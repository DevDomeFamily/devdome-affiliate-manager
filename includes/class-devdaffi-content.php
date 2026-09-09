<?php
/**
 * Site content for the admin picker — server-side search so it scales to any
 * number of posts/pages/categories (no client-side dump, no row cap).
 *
 * Routes (manage_options):
 *   GET /wp-json/devdaffi/v1/content?q=&type=&page=
 *       → { items:[{type,value,label,link,parentCategory?,childCount?}],
 *           counts:{All,Page,Post,'Post Category'}, total, page, per_page }
 *   GET /wp-json/devdaffi/v1/content/resolve?ids=post:1,page:2,post_cat:3
 *       → { items:[...] }   (labels for already-selected values)
 *
 * Scope = Posts, Pages, Post Categories (the three the resolver models).
 */

defined( 'ABSPATH' ) || exit;

// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Constant table names ($wpdb->prefix); user values use $wpdb->prepare(). False positives for custom-table access.

class DEVDAFFI_Content {

	const PER_PAGE = 50;

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register' ) );
	}

	public function register() {
		$perm = function () {
			return current_user_can( 'manage_options' );
		};
		register_rest_route( 'devdaffi/v1', '/content', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'search' ),
			'permission_callback' => $perm,
		) );
		register_rest_route( 'devdaffi/v1', '/content/resolve', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'resolve' ),
			'permission_callback' => $perm,
		) );
	}

	public function search( WP_REST_Request $req ) {
		$q    = sanitize_text_field( (string) $req->get_param( 'q' ) );
		$type = (string) $req->get_param( 'type' );
		$page = max( 1, (int) $req->get_param( 'page' ) );
		$per  = self::PER_PAGE;

		$counts = array(
			'Page'          => $this->count_posts( 'page', $q ),
			'Post'          => $this->count_posts( 'post', $q ),
			'Post Category' => $this->count_cats( $q ),
		);
		$counts['All'] = $counts['Page'] + $counts['Post'] + $counts['Post Category'];

		if ( 'Page' === $type ) {
			$items = $this->query_posts( 'page', $q, $page, $per );
			$total = $counts['Page'];
		} elseif ( 'Post Category' === $type ) {
			$items = $this->query_cats( $q, $page, $per );
			$total = $counts['Post Category'];
		} elseif ( 'Post' === $type ) {
			$items = $this->query_posts( 'post', $q, $page, $per );
			$total = $counts['Post'];
		} elseif ( 'Product' === $type || 'Product Category' === $type ) {
			$items = array(); // WooCommerce products aren't modeled by the resolver yet
			$total = 0;
		} else {
			// "All" = a blended preview (page 1); type tabs give full pagination.
			$items = array_merge(
				$this->query_posts( 'page', $q, 1, 15 ),
				$this->query_cats( $q, 1, 15 ),
				$this->query_posts( 'post', $q, 1, 20 )
			);
			$total = count( $items );
		}

		return rest_ensure_response( array(
			'items'    => $items,
			'counts'   => $counts,
			'total'    => $total,
			'page'     => $page,
			'per_page' => $per,
		) );
	}

	public function resolve( WP_REST_Request $req ) {
		$vals = array_filter( array_map( 'trim', explode( ',', (string) $req->get_param( 'ids' ) ) ) );
		$buckets = array( 'post' => array(), 'page' => array(), 'post_cat' => array() );
		foreach ( $vals as $v ) {
			$parts = explode( ':', $v, 2 );
			$kind  = $parts[0];
			$id    = isset( $parts[1] ) ? (int) $parts[1] : 0;
			if ( $id && isset( $buckets[ $kind ] ) ) {
				$buckets[ $kind ][] = $id;
			}
		}

		$items = array();
		foreach ( array( 'post', 'page' ) as $pt ) {
			if ( empty( $buckets[ $pt ] ) ) {
				continue;
			}
			$query = new WP_Query( array(
				'post_type'              => $pt,
				'post_status'            => 'any',
				'post__in'               => $buckets[ $pt ],
				'posts_per_page'         => count( $buckets[ $pt ] ),
				'update_post_meta_cache' => false,
				'update_post_term_cache' => false,
				'no_found_rows'          => true,
				'ignore_sticky_posts'    => true,
			) );
			$map = ( 'post' === $pt ) ? $this->post_category_map( $buckets[ $pt ] ) : array();
			foreach ( $query->posts as $p ) {
				$it = array(
					'type'  => 'page' === $pt ? 'Page' : 'Post',
					'value' => $pt . ':' . $p->ID,
					'label' => '' !== $p->post_title ? $p->post_title : '(no title)',
					'link'  => get_permalink( $p ),
				);
				if ( 'post' === $pt && ! empty( $map[ $p->ID ] ) ) {
					$it['parentCategory'] = 'post_cat:' . $map[ $p->ID ];
				}
				$items[] = $it;
			}
		}
		if ( ! empty( $buckets['post_cat'] ) ) {
			$terms = get_terms( array( 'taxonomy' => 'category', 'hide_empty' => false, 'include' => $buckets['post_cat'] ) );
			if ( ! is_wp_error( $terms ) ) {
				foreach ( $terms as $c ) {
					$items[] = $this->cat_item( $c );
				}
			}
		}

		return rest_ensure_response( array( 'items' => $items ) );
	}

	/* ---- queries ---- */

	private function query_posts( $ptype, $q, $page, $per ) {
		$args = array(
			'post_type'              => $ptype,
			'post_status'            => 'publish',
			'posts_per_page'         => $per,
			'paged'                  => $page,
			'orderby'                => '' !== $q ? 'relevance' : 'date',
			'order'                  => 'DESC',
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'no_found_rows'          => true,
			'ignore_sticky_posts'    => true,
		);
		if ( '' !== $q ) {
			$args['s']              = $q;
			$args['search_columns'] = array( 'post_title' );
		}
		$query = new WP_Query( $args );

		$ids = wp_list_pluck( $query->posts, 'ID' );
		$map = ( 'post' === $ptype ) ? $this->post_category_map( $ids ) : array();

		$items = array();
		foreach ( $query->posts as $p ) {
			$item = array(
				'type'  => 'page' === $ptype ? 'Page' : 'Post',
				'value' => $ptype . ':' . $p->ID,
				'label' => '' !== $p->post_title ? $p->post_title : '(no title)',
				'link'  => get_permalink( $p ),
			);
			if ( 'post' === $ptype && ! empty( $map[ $p->ID ] ) ) {
				$item['parentCategory'] = 'post_cat:' . $map[ $p->ID ];
			}
			$items[] = $item;
		}
		return $items;
	}

	private function count_posts( $ptype, $q ) {
		$args = array(
			'post_type'           => $ptype,
			'post_status'         => 'publish',
			'posts_per_page'      => 1,
			'fields'              => 'ids',
			'ignore_sticky_posts' => true,
		);
		if ( '' !== $q ) {
			$args['s']              = $q;
			$args['search_columns'] = array( 'post_title' );
		}
		$query = new WP_Query( $args );
		return (int) $query->found_posts;
	}

	private function query_cats( $q, $page, $per ) {
		$terms = get_terms( array(
			'taxonomy'   => 'category',
			'hide_empty' => false,
			'search'     => $q,
			'number'     => $per,
			'offset'     => ( $page - 1 ) * $per,
			'orderby'    => 'name',
			'order'      => 'ASC',
		) );
		if ( is_wp_error( $terms ) ) {
			return array();
		}
		return array_map( array( $this, 'cat_item' ), $terms );
	}

	private function count_cats( $q ) {
		$n = get_terms( array( 'taxonomy' => 'category', 'hide_empty' => false, 'search' => $q, 'fields' => 'count' ) );
		return is_wp_error( $n ) ? 0 : (int) $n;
	}

	private function cat_item( $c ) {
		$link = get_term_link( $c );
		return array(
			'type'           => 'Post Category',
			'value'          => 'post_cat:' . $c->term_id,
			'label'          => $c->name,
			'link'           => is_wp_error( $link ) ? '' : $link,
			'parentCategory' => $c->parent ? 'post_cat:' . $c->parent : null,
			'childCount'     => (int) $c->count,
			'childLabel'     => 'Posts',
		);
	}

	/** One batched query: post ID => first attached category term_id. */
	private function post_category_map( array $post_ids ) {
		global $wpdb;
		if ( empty( $post_ids ) ) {
			return array();
		}
		$ids = implode( ',', array_map( 'intval', $post_ids ) );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery -- $ids is intval-sanitized; bulk read for the admin picker.
		$rows = $wpdb->get_results(
			"SELECT tr.object_id, tt.term_id
			 FROM {$wpdb->term_relationships} tr
			 INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
			 WHERE tt.taxonomy = 'category' AND tr.object_id IN ($ids)
			 ORDER BY tr.object_id ASC, tt.term_id ASC"
		);

		$map = array();
		foreach ( $rows as $r ) {
			$pid = (int) $r->object_id;
			if ( ! isset( $map[ $pid ] ) ) {
				$map[ $pid ] = (int) $r->term_id;
			}
		}
		return $map;
	}
}
