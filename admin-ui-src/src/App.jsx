import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Save, Link, Info, ChevronDown, Plus, Trash2, ExternalLink, BarChart2,
  Activity, ChevronUp, Eraser, Copy, FileText, Shield, Layout, Settings,
  Smartphone, ChevronRight, X, Search, Check, AlertCircle, ArrowRightLeft,
  Layers, Tag as TagIcon, FolderTree, Globe, Loader2, Ban, Pencil, Wand2,
  GripVertical, RotateCcw, Link as LinkIcon, ArrowDownUp, Percent
} from 'lucide-react';

// A REST route with a query string: on plain permalinks cfg.rest already ends in ?rest_route=/devdaffi/v1/, so the query
// joins with "&" (a second "?" made WordPress answer rest_no_route 404; live click-through on test2, 2026-09-17).
const restQuery = (base, route, query) => base + route + (base.indexOf('?') === -1 ? '?' : '&') + query;

// --- Constants & Shared Helpers ---
const TYPE_ORDER = ['Page', 'Post Category', 'Post', 'Product Category', 'Product'];

const getTypeLabel = (type) => {
    if (type === 'Page') return 'Pages';
    if (type === 'Post Category') return 'Post Categories';
    if (type === 'Post') return 'Posts';
    if (type === 'Product Category') return 'Product Categories';
    if (type === 'Product') return 'Products';
    return type;
};

const formatTagLabel = (nickname, domain, affiliateId, index) => {
    const parts = [];
    if (nickname) parts.push(nickname);
    if (domain) parts.push(domain);
    if (affiliateId) parts.push(affiliateId);
    return parts.length > 0 ? parts.join(' | ') : `Tag #${index}`;
};

// Moved outside component to prevent recreating massive arrays on every render
const amazonDomains = [
  { value: "amazon.com", label: "amazon.com (USA)" },
  { value: "amazon.co.uk", label: "amazon.co.uk (UK)" },
  { value: "amazon.de", label: "amazon.de (Germany)" },
  { value: "amazon.fr", label: "amazon.fr (France)" },
  { value: "amazon.co.jp", label: "amazon.co.jp (Japan)" },
  { value: "amazon.ca", label: "amazon.ca (Canada)" },
  { value: "amazon.it", label: "amazon.it (Italy)" },
  { value: "amazon.es", label: "amazon.es (Spain)" },
  { value: "amazon.in", label: "amazon.in (India)" },
  { value: "amazon.com.au", label: "amazon.com.au (Australia)" },
  { value: "amazon.com.br", label: "amazon.com.br (Brazil)" },
  { value: "amazon.com.mx", label: "amazon.com.mx (Mexico)" },
  { value: "amazon.nl", label: "amazon.nl (Netherlands)" },
  { value: "amazon.sg", label: "amazon.sg (Singapore)" },
  { value: "amazon.ae", label: "amazon.ae (UAE)" },
  { value: "amazon.sa", label: "amazon.sa (Saudi Arabia)" },
  { value: "amazon.se", label: "amazon.se (Sweden)" },
  { value: "amazon.pl", label: "amazon.pl (Poland)" },
  { value: "amazon.com.tr", label: "amazon.com.tr (Turkey)" },
  { value: "amazon.eg", label: "amazon.eg (Egypt)" },
  { value: "amazon.com.be", label: "amazon.com.be (Belgium)" },
  { value: "amazon.co.za", label: "amazon.co.za (South Africa)" }
];

// Populated from the /content REST endpoint when running inside WP admin.
// The mock entries below are only used in standalone dev preview (no DEVDAFFI_ADMIN).
let targetOptions = [
  // Pages (1)
  { type: "Page", value: "page:home", label: "Home Page", link: "https://yourwebsite.com/", linkCount: 2 },
  { type: "Page", value: "page:about", label: "About Us", link: "https://yourwebsite.com/about", linkCount: 1 },
  { type: "Page", value: "page:contact", label: "Contact Us", link: "https://yourwebsite.com/contact", linkCount: 0 },
  
  // Post Categories (2)
  { type: "Post Category", value: "post_cat:tech", label: "Tech News", link: "https://yourwebsite.com/category/tech", linkCount: 47, childCount: 12, childLabel: "Posts" },
  { type: "Post Category", value: "post_cat:hardware", label: "Hardware & Gear", link: "https://yourwebsite.com/category/tech/hardware", parentCategory: "post_cat:tech", linkCount: 15, childCount: 4, childLabel: "Posts" },
  { type: "Post Category", value: "post_cat:laptops", label: "Laptops", link: "https://yourwebsite.com/category/tech/hardware/laptops", parentCategory: "post_cat:hardware", linkCount: 8, childCount: 2, childLabel: "Posts" },
  { type: "Post Category", value: "post_cat:reviews", label: "Product Reviews", link: "https://yourwebsite.com/category/reviews", linkCount: 89, childCount: 24, childLabel: "Posts" },
  
  // Posts (3)
  { type: "Post", value: "post:1", label: "Top 10 Wireless Headphones 2024", link: "https://yourwebsite.com/blog/top-10-headphones", parentCategory: "post_cat:hardware", linkCount: 12 },
  { type: "Post", value: "post:2", label: "Ultimate Guide to Smart Home Devices", link: "https://yourwebsite.com/blog/smart-home-guide", parentCategory: "post_cat:tech", linkCount: 34 },
  { type: "Post", value: "post:3", label: "Best Summer Reads for 2024", link: "https://yourwebsite.com/blog/summer-reads", parentCategory: "post_cat:reviews", linkCount: 5 },
  { type: "Post", value: "post:macbook", label: "Apple M3 MacBook Air Review", link: "https://yourwebsite.com/blog/m3-macbook", parentCategory: "post_cat:laptops", linkCount: 5 },
  { type: "Post", value: "post:dell", label: "Dell XPS 15 Deep Dive", link: "https://yourwebsite.com/blog/dell-xps-15", parentCategory: "post_cat:laptops", linkCount: 3 },
  
  // Product Categories (4)
  { type: "Product Category", value: "cat:electronics", label: "Electronics", link: "https://yourwebsite.com/category/electronics", linkCount: 120, childCount: 56, childLabel: "Products" },
  { type: "Product Category", value: "cat:audio", label: "Audio Equipment", link: "https://yourwebsite.com/category/electronics/audio", parentCategory: "cat:electronics", linkCount: 45, childCount: 18, childLabel: "Products" },
  { type: "Product Category", value: "cat:home", label: "Home & Kitchen", link: "https://yourwebsite.com/category/home-kitchen", linkCount: 67, childCount: 31, childLabel: "Products" },

  // Products (5)
  { type: "Product", value: "prod:p1", label: "Sony WH-1000XM5 Headphones", link: "https://yourwebsite.com/product/sony-headphones", parentCategory: "cat:audio", linkCount: 1 },
  { type: "Product", value: "prod:p2", label: "Amazon Kindle Paperwhite", link: "https://yourwebsite.com/product/kindle-paperwhite", parentCategory: "cat:electronics", linkCount: 1 },
  { type: "Product", value: "prod:p3", label: "Samsung Galaxy S24 Ultra", link: "https://yourwebsite.com/product/samsung-s24", parentCategory: "cat:electronics", linkCount: 1 },
  { type: "Product", value: "prod:p4", label: "Dyson V15 Detect Vacuum", link: "https://yourwebsite.com/product/dyson-v15", parentCategory: "cat:home", linkCount: 1 }
].filter(o => (o.linkCount || 0) > 0);

const getOptionData = (val) => targetOptions.find(opt => opt.value === val);
const getLinkForValue = (val) => getOptionData(val)?.link || '#';

// Server-side search returns one page at a time; we keep a growing client cache
// of seen items so getOptionData() can label already-selected values anywhere.
const cacheItems = (items) => {
  if (!Array.isArray(items) || !items.length) return;
  const seen = new Set(targetOptions.map(o => o.value));
  const add = items.filter(o => o && o.value && !seen.has(o.value));
  if (add.length) targetOptions = targetOptions.concat(add);
};

// Map the UI's flat ruleValues (["post:12","page:5","post_cat:8"]) to the backend
// schema rules{posts,pages,post_cats} and back. Product types (cat:/prod:) are
// ignored — the resolver doesn't model WooCommerce yet.
const ruleValuesToRules = (vals = []) => {
  const out = { posts: [], pages: [], post_cats: [] };
  vals.forEach(v => {
    const idx = String(v).indexOf(':');
    if (idx < 0) return;
    const kind = v.slice(0, idx);
    const id = parseInt(v.slice(idx + 1), 10);
    if (!id) return;
    if (kind === 'post') out.posts.push(id);
    else if (kind === 'page') out.pages.push(id);
    else if (kind === 'post_cat') out.post_cats.push(id);
  });
  return out;
};
const rulesToRuleValues = (rules = {}) => [
  ...(rules.posts || []).map(i => `post:${i}`),
  ...(rules.pages || []).map(i => `page:${i}`),
  ...(rules.post_cats || []).map(i => `post_cat:${i}`),
];

// Exclusions (UI globalExclusions/globalExcludedTrees/globalExceptions) ↔ backend
// exclusions{posts,pages,cats,except_posts,except_pages}.
const splitVal = (v) => {
  const i = String(v).indexOf(':');
  return i < 0 ? [null, 0] : [v.slice(0, i), parseInt(v.slice(i + 1), 10) || 0];
};
const exclusionsToBackend = (excl = [], trees = [], exc = []) => {
  const out = { posts: [], pages: [], cats: [], except_posts: [], except_pages: [] };
  excl.forEach(v => { const [k, id] = splitVal(v); if (!id) return; if (k === 'post') out.posts.push(id); else if (k === 'page') out.pages.push(id); else if (k === 'post_cat') out.cats.push(id); });
  trees.forEach(v => { const [k, id] = splitVal(v); if (id && k === 'post_cat') out.cats.push(id); });
  exc.forEach(v => { const [k, id] = splitVal(v); if (!id) return; if (k === 'post') out.except_posts.push(id); else if (k === 'page') out.except_pages.push(id); });
  out.cats = Array.from(new Set(out.cats));
  return out;
};
const backendToExclusions = (ex = {}) => ({
  globalExclusions: [...(ex.posts || []).map(i => `post:${i}`), ...(ex.pages || []).map(i => `page:${i}`)],
  globalExcludedTrees: (ex.cats || []).map(i => `post_cat:${i}`),
  globalExceptions: [...(ex.except_posts || []).map(i => `post:${i}`), ...(ex.except_pages || []).map(i => `page:${i}`)],
});

// --- Flat Data Handlers ---
const getFilteredData = (optionsToSearch, search, filterType) => {
    const lowerSearch = search.toLowerCase();
    const matched = optionsToSearch.filter(o => !search || o.label.toLowerCase().includes(lowerSearch) || (o.link && o.link.toLowerCase().includes(lowerSearch)));
    
    if (filterType === "All") return matched;
    return matched.filter(o => o.type === filterType);
};

const getTabCounts = (optionsToSearch) => {
    let pageCount = 0, postCount = 0, postCatCount = 0, productCount = 0, productCatCount = 0;
    optionsToSearch.forEach(opt => {
        if (opt.type === 'Page') pageCount++;
        if (opt.type === 'Post Category') postCatCount++;
        if (opt.type === 'Post') postCount++;
        if (opt.type === 'Product Category') productCatCount++;
        if (opt.type === 'Product') productCount++;
    });
    return { 
        "All": optionsToSearch.length, 
        "Page": pageCount, 
        "Post Category": postCatCount,
        "Post": postCount, 
        "Product Category": productCatCount,
        "Product": productCount
    };
};

// --- UI Components ---
const Section = React.memo(({ title, icon: Icon, action, children, className = "" }) => (
  <div className={`space-y-6 ${className}`}>
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-6">
      <div className="flex items-center gap-2">
         {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
         <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
    {children}
  </div>
));

const Hint = React.memo(({ text, className = "" }) => (
  <div className={`flex items-start gap-2 mt-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-xs border border-blue-100 w-fit max-w-full ${className}`}>
    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
    <span className="leading-5">{text}</span>
  </div>
));

const InfoTooltip = React.memo(({ text, alignment = 'center', direction = 'top', className = "" }) => (
  <div className={`group/tooltip relative flex items-center ${className}`}>
    <Info size={14} className="text-indigo-400 hover:text-indigo-600 transition-colors cursor-help" />
    <div className={`absolute ${direction === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} w-max max-w-[260px] p-3 bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-[9999] text-center font-normal leading-relaxed invisible group-hover/tooltip:visible whitespace-normal text-balance ${alignment === 'right' ? 'right-[-4px]' : alignment === 'left' ? 'left-[-4px]' : 'left-1/2 -translate-x-1/2'}`}>
      {text}
      {direction === 'top' ? (
          <>
            <div className={`absolute top-full w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-indigo-100 ${alignment === 'right' ? 'right-[8px]' : alignment === 'left' ? 'left-[8px]' : 'left-1/2 -translate-x-1/2'}`}></div>
            <div className={`absolute top-full -mt-[1px] w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-indigo-50 ${alignment === 'right' ? 'right-[8px]' : alignment === 'left' ? 'left-[8px]' : 'left-1/2 -translate-x-1/2'}`}></div>
          </>
      ) : (
          <>
            <div className={`absolute bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-indigo-100 ${alignment === 'right' ? 'right-[8px]' : alignment === 'left' ? 'left-[8px]' : 'left-1/2 -translate-x-1/2'}`}></div>
            <div className={`absolute bottom-full -mb-[1px] w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-indigo-50 ${alignment === 'right' ? 'right-[8px]' : alignment === 'left' ? 'left-[8px]' : 'left-1/2 -translate-x-1/2'}`}></div>
          </>
      )}
    </div>
  </div>
));

const SettingRow = React.memo(({ label, tooltip, hint, children, className = "" }) => (
  <div className={`grid grid-cols-[210px_1fr] gap-6 items-start border-b border-gray-50 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0 animate-in fade-in slide-in-from-top-2 duration-300 ${className}`}>
    <label className="text-sm font-bold text-gray-600 pt-2.5 flex items-center gap-1.5">
      {label}
      {tooltip && !hint && <InfoTooltip text={tooltip} />}
    </label>
    <div className="w-full">
      {children}
      {hint && (
        <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5">
          <span>{hint}</span>
          {tooltip && <InfoTooltip text={tooltip} />}
        </p>
      )}
    </div>
  </div>
));

const SimpleCheckbox = React.memo(({ name, checked, onChange, label, className = "" }) => (
  <label className={`inline-flex items-center cursor-pointer min-h-[40px] ${className}`}>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0" />
    <span className="ml-2 text-sm font-semibold text-gray-700">{label}</span>
  </label>
));

const CheckboxDropdown = React.memo(({ label, icon: Icon, children, tooltip, compact, scrollable = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { 
        if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); 
    };
    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 280 && rect.top > spaceBelow) {
                setOpenUpwards(true);
            } else {
                setOpenUpwards(false);
            }
        }
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative flex items-center" ref={ref}>
      <button 
         type="button" 
         onClick={() => setIsOpen(!isOpen)} 
         className={`flex items-center gap-1.5 px-2.5 py-1 bg-white border rounded-md text-[11px] font-bold transition-colors shadow-sm h-7 ${isOpen ? 'border-indigo-400 ring-1 ring-indigo-500/20 text-indigo-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
         title={tooltip}
      >
        {Icon && <Icon size={12} className={isOpen ? "text-indigo-500" : "text-gray-500"} />}
        <span>{label}</span>
        <ChevronDown size={13} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className={`absolute ${openUpwards ? 'bottom-[calc(100%+4px)] mb-1 origin-bottom' : 'top-[calc(100%+4px)] mt-1 origin-top'} right-0 ${compact ? 'w-max min-w-0' : 'min-w-[320px] sm:min-w-[400px]'} bg-white border border-gray-200 shadow-xl rounded-lg p-1.5 z-[999] animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5 ${scrollable ? 'max-h-[60vh] overflow-y-auto custom-scrollbar' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
});

const RadioGroup = React.memo(({ title, name, options, value, onChange }) => (
  <div className="space-y-3">
    {title && <span className="text-[11px] font-bold text-gray-600 block mb-4">{title}</span>}
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <div key={option.value} className="flex flex-col">
          <div className="flex items-center gap-1.5">
              <label className="flex items-center gap-2 cursor-pointer group select-none w-max">
                <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={(e) => onChange(name, e.target.value)} className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-50 cursor-pointer flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{option.label}</span>
              </label>
              {option.hint && <InfoTooltip text={option.hint} alignment="center" />}
          </div>
          {option.description && (
            <div className="flex items-start gap-1.5 mt-1 text-xs text-gray-500">
              <ChevronRight size={12} className="mt-0.5 text-indigo-400 flex-shrink-0" />
              <span className="leading-relaxed">{option.description}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
));

const StyledInput = React.memo((props) => (
  <input {...props} className={`w-full px-3 py-1.5 h-[34px] bg-white border border-gray-400 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow text-gray-700 disabled:bg-gray-50 disabled:text-gray-500 ${props.className || ''}`} />
));

const NumberInput = React.memo(({ value, onChange, min, max, placeholder, className }) => {
    const handleInput = (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = '';
        else if (val > max) val = max;
        else if (val < min) val = min;
        onChange(val);
    };

    return (
        <input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleInput}
            placeholder={placeholder}
            min={min}
            max={max}
            className={`text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm text-gray-900 ${className}`} 
        />
    );
});

const StyledSelect = React.memo(({ children, name, value, onChange, placeholder, className = "", wrapperClassName = "", truncate = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const options = React.Children.toArray(children).reduce((acc, child) => {
    if (child.type === 'option') {
      const optionValue = child.props.value !== undefined ? child.props.value : child.props.children;
      acc.push({ value: optionValue, label: child.props.children });
    }
    return acc;
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => { if (!containerRef.current) return; const path = typeof e.composedPath === 'function' ? e.composedPath() : []; if (path.includes(containerRef.current) || containerRef.current.contains(e.target)) return; setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${wrapperClassName}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-1.5 h-[34px] bg-white border border-gray-400 rounded-lg text-[13px] font-semibold cursor-pointer transition-all shadow text-gray-700 select-none ${isOpen ? 'ring-2 ring-indigo-500/20 border-indigo-500' : ''} ${className}`}
      >
        <span className={`${truncate ? 'truncate' : 'whitespace-nowrap'} ${!selectedOption ? 'text-gray-400' : ''}`}>{selectedOption ? selectedOption.label : (placeholder || 'Select option')}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 min-w-full w-max bg-white border border-gray-200 rounded-lg shadow-xl z-[999] flex flex-col animate-in fade-in zoom-in-95 duration-100 py-1 overflow-hidden">
          <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
            {options.map((item) => (
                <div key={item.value} onClick={() => { onChange({ target: { name, value: item.value } }); setIsOpen(false); }} className={`px-3 py-1.5 transition-colors cursor-pointer text-[13px] font-semibold flex items-center justify-between gap-4 ${truncate ? '' : 'whitespace-nowrap'} ${item.value === value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <span className={truncate ? 'truncate pr-2' : ''}>{item.label}</span>
                  {item.value === value && <Check size={14} className="text-indigo-600 shrink-0" strokeWidth={3} />}
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const KeywordTokenInput = React.memo(({ value, onChange, placeholder, className }) => {
    const [inputValue, setInputValue] = useState('');
    const keywords = value ? value.split(',').map(k => k.trim()).filter(Boolean) : [];

    const addKeyword = useCallback((keyword) => {
        const newKeywords = keyword.split(',').map(k => k.trim()).filter(Boolean);
        const uniqueNew = newKeywords.filter(k => !keywords.includes(k));
        if (uniqueNew.length > 0) {
            onChange([...keywords, ...uniqueNew].join(', '));
        }
        setInputValue('');
    }, [keywords, onChange]);

    const removeKeyword = useCallback((keywordToRemove) => {
        onChange(keywords.filter(k => k !== keywordToRemove).join(', '));
    }, [keywords, onChange]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addKeyword(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
            removeKeyword(keywords[keywords.length - 1]);
        }
    }, [inputValue, keywords, addKeyword, removeKeyword]);

    return (
        <div className={`flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-colors shadow-sm min-h-[34px] h-auto ${className}`}>
            {keywords.map((kw, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-bold border border-indigo-100">
                    {kw}
                    <button type="button" onClick={() => removeKeyword(kw)} className="text-indigo-400 hover:text-indigo-600 focus:outline-none ml-0.5">
                        <X size={12} strokeWidth={3} />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addKeyword(inputValue)}
                placeholder={keywords.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[120px] w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 px-1 py-0.5"
            />
        </div>
    );
});

const AutoResizeTextarea = React.memo(({ value, onChange, placeholder, className, rows = 1 }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '0px'; 
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.max(34, scrollHeight)}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`resize-none overflow-hidden ${className}`}
        />
    );
});

const MatchTypeDropdown = React.memo(({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 150 && rect.top > spaceBelow) {
                setOpenUpwards(true);
            } else {
                setOpenUpwards(false);
            }
        }
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between gap-2 px-2.5 py-1 bg-white border border-gray-300 rounded-md text-[11px] font-bold shadow-sm h-7 text-gray-700 min-w-[110px] hover:border-gray-400 transition-colors">
        <span>{value === 'exact' ? 'Exact Match' : 'Broad Match'}</span>
        <ChevronDown size={13} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
      </button>
      {isOpen && (
        <div className={`absolute right-0 ${openUpwards ? 'bottom-[calc(100%+4px)] origin-bottom' : 'top-[calc(100%+4px)] origin-top'} bg-white border border-gray-200 shadow-xl rounded-lg p-1.5 z-[999] w-max min-w-[150px] flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100`}>
           <div onClick={() => { onChange('exact'); setIsOpen(false); }} className={`px-2.5 py-2 rounded cursor-pointer transition-colors flex items-center justify-between gap-3 ${value === 'exact' ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50 border border-transparent'}`}>
              <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold ${value === 'exact' ? 'text-indigo-800' : 'text-gray-800'}`}>Exact Match</span>
                  <InfoTooltip text='Links only this exact word (e.g. "Nike shoe" won&#39;t match "Nike shoes")' alignment="center" />
              </div>
              {value === 'exact' && <Check size={13} className="text-indigo-600"/>}
           </div>
           <div onClick={() => { onChange('broad'); setIsOpen(false); }} className={`px-2.5 py-2 rounded cursor-pointer transition-colors flex items-center justify-between gap-3 ${value === 'broad' ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50 border border-transparent'}`}>
              <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold ${value === 'broad' ? 'text-indigo-800' : 'text-gray-800'}`}>Broad Match</span>
                  <InfoTooltip text='Links similar words and plurals too (e.g. "Nike shoe" also matches "Nike shoes")' alignment="center" />
              </div>
              {value === 'broad' && <Check size={13} className="text-indigo-600"/>}
           </div>
        </div>
      )}
    </div>
  );
});

const ActionGroup = React.memo(({ item, isSelected, isCurrentInherited, isUsedElsewhere, isCategoryMatch, fallsBackToSitewide, usageInfo, sitewideInfo, currentRuleId, currentRuleIndex, onTransfer, onRemove, onRemoveFromOther, allRules, isOpen, setIsOpen }) => {
  const ref = useRef(null);
  const [openUpwards, setOpenUpwards] = useState(false);
  
  useEffect(() => {
      const handleClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
      if (isOpen) {
          document.addEventListener('mousedown', handleClickOutside);
          if (ref.current) {
              const rect = ref.current.getBoundingClientRect();
              const spaceBelow = window.innerHeight - rect.bottom;
              if (spaceBelow < 200 && rect.top > spaceBelow) {
                  setOpenUpwards(true);
              } else {
                  setOpenUpwards(false);
              }
          }
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]); 

  const currentSelectedId = (isSelected || isCurrentInherited) ? currentRuleId : isUsedElsewhere ? usageInfo.ruleId : fallsBackToSitewide ? sitewideInfo.ruleId : '';
  
  const handleRemoveAssignment = (e) => {
      e.stopPropagation();
      if (isSelected) onRemove(item.value); 
      else if (isCurrentInherited) onRemove(item.parentCategory); 
      else if (isCategoryMatch) onRemoveFromOther(item.parentCategory, usageInfo.ruleId); 
      else onRemoveFromOther(item.value, usageInfo.ruleId);
      setIsOpen(false);
  };
  
  const getRuleTooltip = (ruleId) => {
      const rule = allRules.find(r => r.id === ruleId);
      if (!rule) return "Move to tag";
      return formatTagLabel(rule.nickname, rule.domain, rule.affiliateId, rule.index);
  };

  return (
       <div className="flex items-center gap-1.5 h-full" onClick={e => e.stopPropagation()}>
          {currentSelectedId !== currentRuleId && (
              <button type="button" onClick={() => { onTransfer(item.value, currentSelectedId, currentRuleId); setIsOpen(false); }} className="text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-1.5 rounded shadow-sm hover:bg-indigo-100 hover:text-indigo-800 transition-colors flex items-center gap-1.5" title={`Move instantly to ${getRuleTooltip(currentRuleId)}`}>
                  <ArrowRightLeft size={10} strokeWidth={3} /> Tag #{currentRuleIndex}
              </button>
          )}
          <div className="relative flex items-center rounded-md border border-gray-300 shadow-sm bg-white transition-all opacity-95 hover:opacity-100 h-[26px]" ref={ref}>
              <div className="flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer pl-2.5 pr-2 h-full text-gray-700 text-[11px] font-bold" onClick={() => setIsOpen(!isOpen)} title={currentSelectedId ? getRuleTooltip(currentSelectedId) : "Move to another tag"}>
                  <span>Tag #{allRules.find(r => r.id === currentSelectedId)?.index || '?'}</span>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} strokeWidth={2.5} />
              </div>
              {isOpen && (
                  <div className={`absolute right-0 ${openUpwards ? 'bottom-[calc(100%+6px)] origin-bottom' : 'top-[calc(100%+6px)] origin-top'} bg-white border border-gray-200 shadow-2xl rounded-xl p-2 z-[999] min-w-max max-w-[calc(100vw-32px)] overflow-x-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150`}>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1 border-b border-gray-100 pb-1.5 sticky left-0">Move to Tag...</div>
                      <div style={{ display: 'grid', gridTemplateRows: `repeat(${Math.min(10, allRules.length)}, minmax(0, 1fr))`, gridAutoFlow: 'column', gap: '2px 6px' }}>
                          {allRules.map(r => (
                              <button type="button" key={r.id} onClick={() => { if (r.id !== currentSelectedId) onTransfer(item.value, currentSelectedId, r.id); setIsOpen(false); }} title={formatTagLabel(r.nickname, r.domain, r.affiliateId, r.index)} className={`text-left text-[10px] font-bold px-2 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${r.id === currentSelectedId ? 'bg-indigo-50 text-indigo-700 cursor-default ring-1 ring-indigo-200 inset-ring' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                                  {r.id === currentSelectedId ? <Check size={12} strokeWidth={3} /> : <TagIcon size={12} className="opacity-40" />} Tag #{r.index}
                              </button>
                          ))}
                      </div>
                  </div>
              )}
              {!fallsBackToSitewide && (
                  <button type="button" onClick={handleRemoveAssignment} className="px-2 border-l border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center focus:outline-none h-full" title="Remove assignment"><X size={16} strokeWidth={2.5} /></button>
              )}
          </div>
      </div>
  );
});

const AutoLinkTagDropdown = React.memo(({ value, onChange, allRules }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                if (spaceBelow < 250 && rect.top > spaceBelow) {
                    setOpenUpwards(true);
                } else {
                    setOpenUpwards(false);
                }
            }
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const currentRule = allRules.find(r => `tag-${r.id}` === value) || allRules[0];
    if (!currentRule) return null;

    const tooltip = formatTagLabel(currentRule.nickname, currentRule.domain, currentRule.affiliateId, currentRule.index);

    return (
        <div className="relative flex items-center rounded-md border border-gray-300 shadow-sm bg-white transition-all hover:border-indigo-400 min-h-[34px] w-full" ref={ref}>
            <div className="flex items-center justify-between w-full hover:bg-gray-50 cursor-pointer pl-3 pr-2.5 h-full text-gray-700 text-[12px] font-bold rounded-md" onClick={() => setIsOpen(!isOpen)} title={tooltip}>
                <span className="truncate">Tag #{currentRule.index}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 shrink-0 ml-1 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} strokeWidth={2.5} />
            </div>
            {isOpen && (
                <div className={`absolute right-0 ${openUpwards ? 'bottom-[calc(100%+6px)] origin-bottom' : 'top-[calc(100%+6px)] origin-top'} bg-white border border-gray-200 shadow-2xl rounded-xl p-2 z-[999] min-w-[100px] max-w-[calc(100vw-32px)] overflow-x-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150`}>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1 border-b border-gray-100 pb-1.5 sticky left-0">Select Tag</div>
                    <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {allRules.map(r => (
                            <button type="button" key={r.id} onClick={() => { onChange(`tag-${r.id}`); setIsOpen(false); }} title={formatTagLabel(r.nickname, r.domain, r.affiliateId, r.index)} className={`text-left text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${r.id === currentRule.id ? 'bg-indigo-50 text-indigo-700 cursor-default ring-1 ring-indigo-200 inset-ring' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                                {r.id === currentRule.id ? <Check size={14} strokeWidth={3} /> : <TagIcon size={14} className="opacity-40" />} Tag #{r.index} {r.nickname ? `(${r.nickname})` : ''}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

const SearchableDropdown = React.memo(({ options, onSelect, onBulkSelect, onBulkRemove, onTransfer, onRemove, onRemoveFromOther, onRestoreExcluded, placeholder = "Search...", selectedValues = [], usedElsewhere = {}, currentInherited = [], currentRuleIndex, currentRuleId, currentRuleMode, currentRuleNickname, currentRuleDomain, currentRuleAffiliateId, allRules, sitewideInfo, globalExclusions = [], globalExcludedTrees = [], globalExceptions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); 
  const [bulkSelected, setBulkSelected] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);
  
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { 
        if (containerRef.current && !containerRef.current.contains(e.target)) { setIsOpen(false); setBulkSelected([]); } 
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
      if (isOpen && containerRef.current) {
          setTimeout(() => {
              const ruleCard = containerRef.current.closest('[id^="tag-rule-"], [id^="autolink-rule-"]');
              if (ruleCard) {
                  const y = ruleCard.getBoundingClientRect().top + window.scrollY - 24; 
                  window.scrollTo({ top: y, behavior: 'smooth' });
              } else {
                  containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
          }, 100);
      }
  }, [isOpen]);

  // In WP admin the picker searches the server (scales to any number of posts);
  // standalone dev preview falls back to filtering the in-memory options.
  const isWP = typeof window !== 'undefined' && !!window.DEVDAFFI_ADMIN;
  const SERVER_PER = 50;
  const [srv, setSrv] = useState({ items: [], counts: {}, total: 0, loading: false });

  useEffect(() => {
      if (!isWP) return;
      const cfg = window.DEVDAFFI_ADMIN;
      const ctrl = new AbortController();
      setSrv(s => ({ ...s, loading: true }));
      const h = setTimeout(() => {
          const url = restQuery(cfg.rest, 'content', `q=${encodeURIComponent(searchTerm)}&type=${encodeURIComponent(activeFilter)}&page=${currentPage}`);
          fetch(url, { headers: { 'X-WP-Nonce': cfg.nonce }, signal: ctrl.signal })
            .then(r => r.ok ? r.json() : Promise.reject(new Error('content search failed'))) // round 5: an error answer is not an empty list
            .then(d => {
                if (!d || !Array.isArray(d.items)) { setSrv(s => ({ ...s, loading: false })); return; } // round 2: never a stuck spinner
                cacheItems(d.items);
                setSrv({ items: d.items, counts: d.counts || {}, total: d.total || d.items.length, loading: false });
            })
            .catch(() => setSrv(s => ({ ...s, loading: false })));
      }, 250);
      return () => { clearTimeout(h); ctrl.abort(); };
  }, [isWP, searchTerm, activeFilter, currentPage]);

  const { currentItems, tabCounts } = useMemo(() => {
      if (isWP) {
          const c = srv.counts || {};
          return {
              currentItems: srv.items,
              tabCounts: { "All": c.All || 0, "Page": c.Page || 0, "Post Category": c["Post Category"] || 0, "Post": c.Post || 0, "Product Category": 0, "Product": 0 },
          };
      }
      const matched = getFilteredData(options, searchTerm, activeFilter);
      const allMatched = getFilteredData(options, searchTerm, "All");
      return { currentItems: matched, tabCounts: getTabCounts(allMatched) };
  }, [isWP, srv, options, searchTerm, activeFilter]);

  const perPage = isWP ? SERVER_PER : itemsPerPage;
  const totalItems = isWP ? srv.total : currentItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * perPage;
  const endIndex = isWP ? Math.min(startIndex + currentItems.length, totalItems) : Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = isWP ? currentItems : currentItems.slice(startIndex, endIndex);

  useEffect(() => {
      setCurrentPage(1);
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [searchTerm, activeFilter]);

  const handleSelect = useCallback((value, isSelected, isUsedElsewhere, isCategoryMatch, isEffectivelyExcluded) => {
    if (isEffectivelyExcluded) return;
    if (!isSelected && (!isUsedElsewhere || isCategoryMatch)) {
      onSelect(value);
      setSearchTerm("");
    }
  }, [onSelect]);

  const handleBulkToggle = useCallback((e, item) => {
      e.stopPropagation();
      setBulkSelected(prev => {
           const isSelected = prev.includes(item.value);
           let newSet = new Set(prev);
           if (isSelected) newSet.delete(item.value);
           else newSet.add(item.value);
           return Array.from(newSet);
      });
  }, []);

  const renderDropdownItem = (item) => {
      const isExplicitlyExcluded = globalExclusions.includes(item.value);
      const isTreeExcluded = globalExcludedTrees.includes(item.value);
      const isParentTreeExcluded = item.parentCategory && globalExcludedTrees.includes(item.parentCategory);
      const isException = globalExceptions.includes(item.value);
      const isEffectivelyExcluded = isExplicitlyExcluded || ((isTreeExcluded || isParentTreeExcluded) && !isException);

      const isSelected = selectedValues.includes(item.value);
      const isCurrentInherited = currentInherited.includes(item.value);
      const usageInfo = usedElsewhere[item.value];
      const isUsedElsewhere = !!usageInfo;
      const isCategoryMatch = isUsedElsewhere && usageInfo.isCategory;
      const isTakenOrSelected = isSelected || isCurrentInherited || isUsedElsewhere;
      
      const fallsBackToSitewide = !isTakenOrSelected && !!sitewideInfo;
      const explicitlyAssignedToSitewide = (isUsedElsewhere && usageInfo.mode === 'sitewide') || ((isSelected || isCurrentInherited) && currentRuleMode === 'sitewide');
      const showAsSitewide = fallsBackToSitewide || explicitlyAssignedToSitewide;
      
      const activeSitewideNickname = explicitlyAssignedToSitewide ? (isUsedElsewhere ? usageInfo.nickname : currentRuleNickname) : sitewideInfo?.nickname;
      const activeSitewideDomain = explicitlyAssignedToSitewide ? (isUsedElsewhere ? usageInfo.domain : currentRuleDomain) : sitewideInfo?.domain;
      const activeSitewideAffiliateId = explicitlyAssignedToSitewide ? (isUsedElsewhere ? usageInfo.affiliateId : currentRuleAffiliateId) : sitewideInfo?.affiliateId;
      const activeSitewideIndex = explicitlyAssignedToSitewide ? (isUsedElsewhere ? usageInfo.ruleIndex : currentRuleIndex) : sitewideInfo?.ruleIndex;

      const isActionOpen = openActionId === item.value;
      const isBulkChecked = bulkSelected.includes(item.value);

      let rowClass = isEffectivelyExcluded ? "bg-gray-50/80 cursor-default hover:bg-gray-100" : isBulkChecked ? "bg-indigo-50/80 cursor-pointer" : showAsSitewide ? "bg-sky-50 text-sky-900 hover:bg-sky-100 cursor-pointer" : (isSelected || isCurrentInherited) ? "bg-green-50 text-green-900 cursor-default" : isUsedElsewhere ? "bg-amber-50 text-amber-900 cursor-default" : "bg-white hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer";
      const showActionGroup = isTakenOrSelected || fallsBackToSitewide;

      return (
        <div key={item.value} onClick={() => { if (isEffectivelyExcluded) return; if (bulkSelected.length > 0) { handleBulkToggle({stopPropagation: ()=>{}}, item); return; } if (!showActionGroup) handleSelect(item.value, isSelected, isUsedElsewhere, isCategoryMatch, isEffectivelyExcluded); }} className={`relative px-4 py-2.5 transition-colors border-b border-gray-100/70 last:border-0 flex items-start justify-between group ${rowClass} ${isActionOpen ? 'z-[100]' : 'hover:z-50 focus-within:z-50'}`}>
          <div className="flex items-start gap-3 flex-1 min-w-0 pr-3 relative z-10">
            <div className="pt-[5px] shrink-0" onClick={(e) => e.stopPropagation()}><input type="checkbox" disabled={isEffectivelyExcluded || isCurrentInherited} checked={isBulkChecked} onChange={(e) => handleBulkToggle(e, item)} className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 cursor-pointer shadow-sm disabled:opacity-50" /></div>
            <div className="flex flex-col min-w-0 w-full pt-[2px]">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`text-sm font-semibold truncate ${isBulkChecked ? 'text-indigo-900' : ''} ${isEffectivelyExcluded ? 'text-gray-500/80' : ''}`}>{item.label}</span>
                  {isTreeExcluded && <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-red-100 text-red-700" title="This entire category is globally excluded."><FolderTree size={10} strokeWidth={3} /> Category Excluded</span>}
                  {isExplicitlyExcluded && !isTreeExcluded && <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-red-100 text-red-700" title="This specific URL is globally excluded."><Ban size={10} strokeWidth={3} /> URL Excluded</span>}
                  {isParentTreeExcluded && !isException && <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-amber-100 text-amber-700" title="Excluded because its parent category is excluded."><Ban size={10} strokeWidth={3} /> Excluded (Via {targetOptions.find(t => t.value === item.parentCategory)?.label || 'Category'} Category)</span>}
                  {item.childCount > 0 && <span className="flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded shadow-sm border border-sky-100" title={`${item.childCount} ${item.childLabel} inside this category`}><FileText size={10} /> {item.childCount} {item.childLabel}</span>}
                  {item.linkCount > 0 && <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shadow-sm border border-indigo-100" title={`${item.linkCount} Amazon links found in this`}><LinkIcon size={10} /> {item.linkCount} Amazon Links</span>}
                  {(isSelected || isCurrentInherited) && !showAsSitewide && !isEffectivelyExcluded && <span className="flex items-center gap-1 text-[10px] bg-green-200 text-green-900 px-1.5 py-0.5 rounded font-bold tracking-wide" title={formatTagLabel(currentRuleNickname, currentRuleDomain, currentRuleAffiliateId, currentRuleIndex)}><Check size={10} strokeWidth={3} /> Tag #{currentRuleIndex} {currentRuleNickname ? `(${currentRuleNickname})` : ""} {isCurrentInherited ? "• Inherited" : ""}</span>}
                  {!isSelected && !isCurrentInherited && isUsedElsewhere && !showAsSitewide && !isEffectivelyExcluded && <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-amber-200 text-amber-900" title={`Allocated to ${formatTagLabel(usageInfo.nickname, usageInfo.domain, usageInfo.affiliateId, usageInfo.ruleIndex)}`}><TagIcon size={10} /> Tag #{usageInfo.ruleIndex} {usageInfo.nickname ? `(${usageInfo.nickname})` : ""} {usageInfo.isCategory ? "• Inherited" : ""}</span>}
                  {showAsSitewide && !isEffectivelyExcluded && <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-sky-200 text-sky-900" title={`${formatTagLabel(activeSitewideNickname, activeSitewideDomain, activeSitewideAffiliateId, activeSitewideIndex)} (Sitewide)`}><Globe size={10} /> Tag #{activeSitewideIndex} {activeSitewideNickname ? `(${activeSitewideNickname})` : ""} (Sitewide)</span>}
                </div>
                {item.link && (
                  <div className="flex items-start gap-1.5 w-full">
                    <span className={`text-[12px] font-medium font-mono break-all line-clamp-2 leading-snug ${isEffectivelyExcluded ? 'text-gray-400/70' : 'text-gray-500'}`}>{item.link}</span>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`${isEffectivelyExcluded ? 'text-gray-300 hover:text-gray-400' : 'text-gray-400 hover:text-blue-600'} transition-colors shrink-0 mt-0.5`} title="Open in new window"><ExternalLink size={14} /></a>
                  </div>
                )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-[5px] relative z-10" onClick={e => e.stopPropagation()}>
            {bulkSelected.length === 0 && (
               <>
                  {!showActionGroup && !isEffectivelyExcluded && <button type="button" className="text-[11px] font-bold bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md shadow-sm hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors flex items-center gap-1.5" title="Add to current tag" onClick={(e) => { e.stopPropagation(); handleSelect(item.value, isSelected, isUsedElsewhere, isCategoryMatch, isEffectivelyExcluded); }}><Plus size={14} strokeWidth={3} /> Add</button>}
                  {showActionGroup && !isEffectivelyExcluded && <ActionGroup item={item} isSelected={isSelected} isCurrentInherited={isCurrentInherited} isUsedElsewhere={isUsedElsewhere} isCategoryMatch={isCategoryMatch} fallsBackToSitewide={fallsBackToSitewide} usageInfo={usageInfo} sitewideInfo={sitewideInfo} currentRuleId={currentRuleId} currentRuleIndex={currentRuleIndex} onTransfer={onTransfer} onRemove={onRemove} onRemoveFromOther={onRemoveFromOther} allRules={allRules} isOpen={isActionOpen} setIsOpen={(val) => setOpenActionId(val ? item.value : null)}/>}
               </>
            )}
          </div>
        </div>
      );
  };

  const groupedDisplayItems = useMemo(() => {
     return paginatedItems.reduce((acc, opt) => {
         if (!acc[opt.type]) acc[opt.type] = [];
         acc[opt.type].push(opt);
         return acc;
     }, {});
  }, [paginatedItems]);

  const displayRootTypes = Object.keys(groupedDisplayItems).sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative z-20 bg-white rounded-lg">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsOpen(true)} onClick={() => setIsOpen(true)} placeholder={placeholder} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm text-gray-700 placeholder:text-gray-400 relative z-20" />
        <Search className="absolute left-3.5 top-2.5 text-gray-400 z-20 pointer-events-none" size={16} />
        <div className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600 z-20" onClick={() => setIsOpen(!isOpen)}>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-[calc(100%-4px)] left-0 w-full pt-2 bg-white border border-gray-200 rounded-b-lg shadow-xl z-[150] flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center flex-nowrap gap-2 p-2 bg-slate-50 border-b border-gray-200 overflow-x-auto relative z-20 shadow-sm custom-scrollbar">
              <span className="text-[11px] font-bold text-gray-600 pl-1 pr-1.5 whitespace-nowrap flex items-center gap-1">
                 Filters:
                 <InfoTooltip text={`Showing ${options.length} page${options.length === 1 ? '' : 's'} that include Amazon links.`} alignment="left" direction="bottom" className="z-[80]" />
              </span>
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveFilter("All"); }} className={`px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "All" ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>All ({tabCounts["All"]})</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveFilter("Page"); }} className={`px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Page" ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Pages ({tabCounts["Page"]})</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveFilter("Post Category"); }} className={`px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Post Category" ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Post Categories ({tabCounts["Post Category"]})</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveFilter("Post"); }} className={`px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Post" ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Posts ({tabCounts["Post"]})</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveFilter("Product Category"); }} className={`px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Product Category" ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Product Categories ({tabCounts["Product Category"]})</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveFilter("Product"); }} className={`px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Product" ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Products ({tabCounts["Product"]})</button>
          </div>
          <div className="relative flex flex-col">
              <div ref={scrollContainerRef} className="max-h-[380px] min-h-[120px] resize-y overflow-y-auto custom-scrollbar bg-white flex-1">
                {paginatedItems.length === 0 ? <div className="px-4 py-8 text-sm text-gray-500 text-center italic bg-gray-50/50 flex flex-col items-center justify-center"><Search size={24} className="text-gray-300 mb-2" />No matches found for "{searchTerm}".</div> : (
                  displayRootTypes.map((type) => (
                    <div key={type} className="relative">
                      <div className="px-4 py-1.5 bg-gray-100/95 backdrop-blur-sm text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 border-t first:border-t-0 sticky top-0 z-20 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                        {getTypeLabel(type)}
                      </div>
                      {groupedDisplayItems[type].map(item => renderDropdownItem(item))}
                    </div>
                  ))
                )}
              </div>
              {totalItems > 0 && (
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg gap-2">
                      <div className="text-[10px] font-semibold text-gray-500">Showing {startIndex + 1}-{endIndex} of {totalItems} items</div>
                      <div className="flex items-center gap-1 shrink-0">
                          <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.max(1, p - 1)); }} disabled={safePage === 1} className="px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 shadow-sm transition-colors">Prev</button>
                          <span className="text-[10px] font-bold text-gray-600 px-2">Page {safePage} of {totalPages}</span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.min(totalPages, p + 1)); }} disabled={safePage === totalPages} className="px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 shadow-sm transition-colors">Next</button>
                          <div className="items-center gap-1.5 border-l border-gray-200 pl-3 hidden sm:flex ml-1">
                             <span className="text-[10px] font-bold text-gray-500">Show</span>
                             <input type="number" value={itemsPerPage} onChange={(e) => { const val = parseInt(e.target.value, 10); if (!isNaN(val) && val > 0) { setItemsPerPage(val); setCurrentPage(1); } else if (e.target.value === '') setItemsPerPage(''); }} onBlur={(e) => { if (e.target.value === '' || parseInt(e.target.value, 10) < 1) { setItemsPerPage(50); setCurrentPage(1); } }} className="w-10 py-0.5 px-1 border border-gray-300 rounded text-[10px] font-bold focus:border-indigo-500 outline-none text-center shadow-sm text-gray-900" min="1" />
                             <span className="text-[13px] text-gray-600">per page</span>
                          </div>
                      </div>
                  </div>
              )}
          </div>
          {bulkSelected.length > 0 && (() => {
             const adding = bulkSelected.filter(v => !selectedValues.includes(v));
             const removing = bulkSelected.filter(v => selectedValues.includes(v));

             return (
                 <div className="absolute bottom-[44px] right-4 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 z-[120] animate-in slide-in-from-bottom-2 duration-200 border border-gray-700/50 w-max justify-center">
                     <div className="flex items-center gap-2 shrink-0">
                         <span className="flex items-center justify-center bg-indigo-500 text-white w-5 h-5 rounded-full text-[10px] font-bold">{bulkSelected.length}</span>
                         <span className="text-xs font-bold text-gray-200 whitespace-nowrap hidden sm:block">Selected</span>
                     </div>
                     <div className="w-px h-5 bg-gray-700 shrink-0"></div>
                     
                     {adding.length > 0 && (
                         <button type="button" onClick={() => { onBulkSelect(adding); setBulkSelected(prev => prev.filter(v => !adding.includes(v))); }} className="text-[11px] sm:text-[12px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap flex items-center gap-1.5">
                             <Plus size={14} strokeWidth={3} /> Add to Tag #{currentRuleIndex}
                         </button>
                     )}
                     
                     {removing.length > 0 && (
                         <button type="button" onClick={() => { onBulkRemove(removing); setBulkSelected(prev => prev.filter(v => !removing.includes(v))); }} className="text-[11px] sm:text-[12px] font-bold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap flex items-center gap-1.5">
                             <Trash2 size={14} strokeWidth={3} /> Remove from Tag #{currentRuleIndex}
                         </button>
                     )}
                     
                     <div className="w-px h-5 bg-gray-700 shrink-0"></div>
                     <button type="button" onClick={() => setBulkSelected([])} className="text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-1.5 rounded-full shrink-0">
                         <X size={14} />
                     </button>
                 </div>
             );
          })()}
        </div>
      )}
    </div>
  );
});

// --- Main App Component ---
export default function App({ suiteMode = false } = {}) {
  // Suite mode: the bottom slot in PI's Link Control to portal our remaining sections into.
  // Keeping one React tree (this component) so formData state stays shared across both slots.
  const [bottomTarget, setBottomTarget] = useState(null);

  useEffect(() => {
    if (!suiteMode) return;
    const setup = () => {
      const slot = document.getElementById('am-link-control-host-bottom');
      if (!slot) return null;
      if (slot.dataset.amBottomReady && slot.shadowRoot) {
        return slot.shadowRoot.querySelector('.am-bottom-root');
      }
      try {
        const shadow = slot.shadowRoot || slot.attachShadow({ mode: 'open' });
        // Clone AM's stylesheet from light DOM into this shadow root (otherwise Tailwind / preflight don't apply).
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        for (const l of links) {
          if (l.href && /\/devdome-affiliate-manager\/assets\/admin\/index\.css/.test(l.href)) {
            const c = document.createElement('link');
            c.rel = 'stylesheet';
            c.href = l.href;
            shadow.appendChild(c);
            break;
          }
        }
        const root = document.createElement('div');
        root.className = 'am-bottom-root';
        shadow.appendChild(root);
        slot.dataset.amBottomReady = '1';
        return root;
      } catch (e) {
        // attachShadow refused (e.g. already attached without our flag) — give up gracefully.
        return null;
      }
    };

    let target = setup();
    if (target) { setBottomTarget(target); return; }
    const obs = new MutationObserver(() => {
      target = setup();
      if (target) { setBottomTarget(target); obs.disconnect(); }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => obs.disconnect(), 10000);
    return () => { obs.disconnect(); clearTimeout(timeout); };
  }, [suiteMode]);

  const [btn1Editing, setBtn1Editing] = useState(false);
  const [formData, setFormData] = useState({
    btn1Text: 'Check Price On Amazon',
    btn1LinkMode: 'generated',
    btn1Link: '',
    btn1GeneratedDomain: 'amazon.com',
    btn1SkipTag: false,
    btn1FollowMode: 'nofollow',
    btn1OpenInNewTab: true,
    btn1Sponsored: true,
    btn1AffiliateRules: [],
    globalExclusions: [],
    globalExcludedTrees: [],
    globalExceptions: [],
    geoEnabled: false,
    enabled: false,
    androidMode: 'browser',
    iosOpenInSafari: false,
    blockBots: true,
    redirectMethod: 'js_302',
    scanFrequency: '7',
    scanFrequencyUnit: 'days',
    scanAuto: false,
    monitorOosToSearch: false,
    monitorDeadToSearch: false,
    monitorOosMode: 'replacement',
    monitorDeadMode: 'replacement',
    autoLinkerEnabled: false,
    autoLinkerLimit: 2,
    autoLinkerApplyPosts: true,
    autoLinkerApplyPages: true,
    autoLinkerApplyProducts: true,
    autoLinkerSkipHeadings: true,
    autoLinkerSkipLinks: true,
    autoLinkerSkipCode: true,
    autoLinkerSkipFirstParagraph: false,
    autoLinkerSkipBlockquotes: true,
    autoLinkerRules: []
  });

  const [exclusionModalType, setExclusionModalType] = useState(null);
  const [exclusionTab, setExclusionTab] = useState('all');
  const [exclusionSearch, setExclusionSearch] = useState('');
  const [showExclusionSearch, setShowExclusionSearch] = useState(false);
  const [exclusionCurrentPage, setExclusionCurrentPage] = useState(1);
  const [exclusionItemsPerPage, setExclusionItemsPerPage] = useState(50);
  const [exclusionTypeFilter, setExclusionTypeFilter] = useState('All');
  const [exclusionSelectedItems, setExclusionSelectedItems] = useState([]);
  const [exclusionLastSelected, setExclusionLastSelected] = useState(null);
  
  const addRuleButtonRef = useRef(null);
  const [tagsExpanded, setTagsExpanded] = useState(true);
  const [editingNicknames, setEditingNicknames] = useState({});
  const [collapsedAssignedLists, setCollapsedAssignedLists] = useState({});
  const [showTagSearch, setShowTagSearch] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [dragEnabledId, setDragEnabledId] = useState(null);
  const [draggedRuleIdx, setDraggedRuleIdx] = useState(null);
  const [dragOverRuleIdx, setDragOverRuleIdx] = useState(null);
  const [tagSortOrder, setTagSortOrder] = useState(0); 
  
  const [hasScannedSite, setHasScannedSite] = useState(false);
  const [amazonLinksFound, setAmazonLinksFound] = useState(0);
  const [scanPages, setScanPages] = useState(0);
  const [scanState, setScanState] = useState('idle');
  const [monitorSummary, setMonitorSummary] = useState({ total: 0, checked: 0, ok: 0, oos: 0, dead: 0, unchecked: 0 });
  // {connected, connect_url, usage:{plan,limit,used,remaining,geo}, state:'ok'|'connect'|'quota'|'unavailable'}
  const [svcUsage, setSvcUsage] = useState(null);
  const [monitorProblems, setMonitorProblems] = useState([]);
  const [loadError, setLoadError] = useState(false); // round 5: the settings request failed
  const [monitorHasMore, setMonitorHasMore] = useState(false); // round 3: the lists hold the first 100 flagged products
  const [replaceUnfinished, setReplaceUnfinished] = useState([]); // round 4: posts an interrupted replacement left unverified
  const [monitorState, setMonitorState] = useState('idle'); // idle | checking
  const [monitorRefresh, setMonitorRefresh] = useState(null); // 'oos' | 'dead' | null — which status is re-checking
  const [expandedProblems, setExpandedProblems] = useState({}); // asin → bool, expandable problem rows
  const [listOpen, setListOpen] = useState(() => {
    // Restore Live / OOS / 404 open state from localStorage so refresh preserves the user's last layout.
    try { const s = localStorage.getItem('devdaffi_link_health_open'); if (s) { const v = JSON.parse(s); if (v && typeof v === 'object' && !Array.isArray(v)) return v; } } catch (e) {} // round 6: a corrupt value never blanks the screen
    return { dead: false, oos: false, ok: false };
  });
  const [liveState, setLiveState] = useState({ items: [], loading: false, offset: 0, hasMore: false, loaded: false }); // Live ASINs lazy-loaded via /monitor/by-status
  const [monitorSearch, setMonitorSearch] = useState({}); // per-group (ok/oos/dead) ASIN search filter
  const [monitorPage, setMonitorPage] = useState({});     // per-group current page
  const [monitorPerPage, setMonitorPerPage] = useState(10); // shared page size for the ASIN tables
  const [pagesPage, setPagesPage] = useState({});         // per-ASIN page for the expanded "used on N pages" list
  const MON_PER_PAGE_OPTIONS = [10, 25, 50, 100];
  useEffect(() => { try { localStorage.setItem('devdaffi_link_health_open', JSON.stringify(listOpen)); } catch (e) {} }, [listOpen]);
  const [replaceVal, setReplaceVal] = useState({}); // old asin → typed new asin
  const [replaceBusy, setReplaceBusy] = useState(null); // asin currently being replaced
  const [botsBlocked, setBotsBlocked] = useState(0); // Click Protection: bot clicks blocked
  
  const globalTagSearchRef = useRef(null);
  const exclusionSearchRef = useRef(null);

  const [autoLinkerExpanded, setAutoLinkerExpanded] = useState(false);
  const [showAutoLinkerGlobalSettings, setShowAutoLinkerGlobalSettings] = useState(false);
  const [showAutoLinkerSearch, setShowAutoLinkerSearch] = useState(false);
  const [autoLinkerSearchQuery, setAutoLinkerSearchQuery] = useState('');
  const [autoLinkerDragEnabledId, setAutoLinkerDragEnabledId] = useState(null);
  const [autoLinkerDraggedRuleIdx, setAutoLinkerDraggedRuleIdx] = useState(null);
  const [autoLinkerDragOverRuleIdx, setAutoLinkerDragOverRuleIdx] = useState(null);
  const [expandedAutoLinkSettings, setExpandedAutoLinkSettings] = useState({}); 
  const [autoLinkerSortOrder, setAutoLinkerSortOrder] = useState(0); 
  
  const globalAutoLinkerSearchRef = useRef(null);
  const modalScrollRef = useRef(null);

  // --- Backend wiring (Link Setup): load settings + real site content on mount. ---
  // Other sections (auto-linker/scanner/etc.) have no backend yet.
  const savedDefaultTag = useRef('');
  const savedAffiliateIds = useRef([]); // affiliate ids as loaded: a changed id loses its click rows on save (round 6)
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const [loaded, setLoaded] = useState(false); // settings fetched? (block Save until then)
  const [, setContentReady] = useState(0); // bump to re-render after targetOptions loads

  useEffect(() => {
    const cfg = window.DEVDAFFI_ADMIN;
    if (!cfg) { setLoaded(true); return; } // standalone/dev preview — keep mock data
    const headers = { 'X-WP-Nonce': cfg.nonce };
    targetOptions = []; // WP mode: empty label cache (the picker searches the server)

    fetch(cfg.rest + 'settings', { headers })
      .then(r => { if (!r.ok) throw new Error('settings load failed'); return r.json(); }) // round 3: a REST error JSON must never become empty settings + an enabled Save
      .then(data => {
        if (!data || typeof data !== 'object' || !Array.isArray(data.tags)) throw new Error('settings shape');
        savedDefaultTag.current = data.default_tag || '';
        savedAffiliateIds.current = (Array.isArray(data.tags) ? data.tags : []).map(t => String(t.affiliate_id || '')).filter(Boolean);
        setReplaceUnfinished(Array.isArray(data.replace_unfinished) ? data.replace_unfinished : []);
        const lo = data.link_options || {};
        const tags = Array.isArray(data.tags) ? data.tags : [];
        const exc = backendToExclusions(data.exclusions || {});
        const b = data.button || {};
        const clicksMap = data.clicks || {};
        const al = data.auto_linker || {};
        const ap = al.apply || {};
        const sk = al.skip || {};
        const scan = data.scan || {};
        const ma = data.mobile_app || {};
        const cp = data.click_protection || {};
        setBotsBlocked(data.bots_blocked || 0);
        setFormData(prev => ({
          ...prev,
          btn1Text: b.text || prev.btn1Text,
          btn1LinkMode: b.link_mode === 'custom' ? 'custom' : 'generated',
          btn1Link: b.custom_link || '',
          btn1GeneratedDomain: b.generated_domain || prev.btn1GeneratedDomain,
          btn1SkipTag: !!b.skip_tag,
          btn1AffiliateRules: tags.length
            ? tags.map((t, i) => ({
                id: t.id || i + 1,
                affiliateId: t.affiliate_id || '',
                domain: t.domain || 'amazon.com',
                mode: t.mode === 'rules' ? 'rules' : 'sitewide',
                enabled: t.enabled !== false,
                nickname: t.nickname || '', ruleValues: rulesToRuleValues(t.rules),
                clicks: clicksMap[t.affiliate_id] || 0,
              }))
            : prev.btn1AffiliateRules,
          geoEnabled: !!data.geo_enabled,
          btn1FollowMode: lo.rel === 'follow' ? 'follow' : 'nofollow',
          btn1OpenInNewTab: !!lo.new_tab,
          btn1Sponsored: 'sponsored' in lo ? !!lo.sponsored : prev.btn1Sponsored,
          globalExclusions: exc.globalExclusions,
          globalExcludedTrees: exc.globalExcludedTrees,
          globalExceptions: exc.globalExceptions,
          autoLinkerEnabled: !!al.enabled,
          autoLinkerLimit: al.limit || 2,
          autoLinkerApplyPosts: ap.posts !== false,
          autoLinkerApplyPages: ap.pages !== false,
          autoLinkerApplyProducts: ap.products !== false,
          autoLinkerSkipHeadings: sk.headings !== false,
          autoLinkerSkipLinks: sk.links !== false,
          autoLinkerSkipCode: sk.code !== false,
          autoLinkerSkipFirstParagraph: !!sk.first_paragraph,
          autoLinkerSkipBlockquotes: sk.blockquotes !== false,
          scanFrequency: String(data.scan_frequency || 7),
          scanFrequencyUnit: data.scan_frequency_unit === 'hours' ? 'hours' : 'days',
          scanAuto: !!data.scan_auto,
          monitorOosToSearch: !!(data.monitor && data.monitor.oos_to_search),
          monitorDeadToSearch: !!(data.monitor && data.monitor.dead_to_search),
          monitorOosMode: (data.monitor && data.monitor.oos_mode === 'search') ? 'search' : 'replacement',
          monitorDeadMode: (data.monitor && data.monitor.dead_mode === 'search') ? 'search' : 'replacement',
          enabled: !!ma.enabled,
          iosOpenInSafari: ma.ios_safari_button !== false,
          androidMode: ma.android_mode === 'intent' ? 'intent' : 'browser',
          blockBots: cp.block_bots !== false,
          redirectMethod: ['js_302', 'js', '302'].includes(cp.redirect_method) ? cp.redirect_method : 'js_302',
          autoLinkerRules: Array.isArray(al.rules)
            ? al.rules.map((r, i) => ({
                id: r.id || i + 1,
                nickname: r.nickname || '',
                keywords: r.keywords || '',
                link: r.link || '',
                tag: r.tag || '',
                matchType: r.match_type === 'broad' ? 'broad' : 'exact',
                caseSensitive: !!r.case_sensitive,
                maxLinks: r.max_links ? String(r.max_links) : '',
                firstMatchOnly: !!r.first_match_only,
                enabled: r.enabled !== false,
                clicks: clicksMap['__rule__' + (r.id || '')] || 0, isBroken: false,
              }))
            : prev.autoLinkerRules,
        }));
        setLoaded(true); // real settings are in — Save is now safe

        // Reflect any prior scan so the Link Radar shows real counts on open.
        if ((scan.links || 0) > 0) {
          setHasScannedSite(true);
          setAmazonLinksFound(scan.links);
          setScanPages(scan.pages || 0);
          setScanState('done');
        }
        if (data.monitor_summary) setMonitorSummary(data.monitor_summary);

        // Resolve labels for already-selected rule targets + exclusions (so the
        // assigned/excluded lists show names — those IDs may not be in any search page).
        const selected = [...exc.globalExclusions, ...exc.globalExcludedTrees, ...exc.globalExceptions];
        tags.forEach(t => selected.push(...rulesToRuleValues(t.rules)));
        if (selected.length) {
          fetch(`${cfg.rest}content/resolve?ids=${encodeURIComponent(selected.join(','))}`, { headers })
            .then(r => r.json())
            .then(d => { if (d && Array.isArray(d.items)) { cacheItems(d.items); setContentReady(c => c + 1); } })
            .catch(() => {}); // labels are cosmetic; the settings are loaded
        }
      })
      .catch(() => { setLoadError(true); }); // rounds 2-5: the spinner turns into an error with a retry, never a silent hang

    // Link Radar monitor: load current dead/OOS issues so the section shows them on open.
    fetch(cfg.rest + 'monitor', { headers })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => { if (ok && d && d.summary) { setMonitorSummary(d.summary); setMonitorProblems(d.problems || []); setMonitorHasMore(!!d.has_more); } else { window.alert((d && d.message) || 'The Link Radar counts could not be read.'); } }) // round 5: a failed read is said, not "never checked"
      .catch(() => window.alert('The Link Radar counts could not be read.'));

    // Account meter: connection state + this month's Link Radar quota (proxied server-side).
    fetch(cfg.rest + 'usage', { headers })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => { if (ok && d && d.state) setSvcUsage(d); else setSvcUsage({ connected: false, usage: null, state: 'unavailable' }); }) // round 5
      .catch(() => setSvcUsage({ connected: false, usage: null, state: 'unavailable' }));
  }, []);

  const handleSave = useCallback(() => {
    const cfg = window.DEVDAFFI_ADMIN;
    if (!cfg || !loaded) return; // never POST the initial mock data over real settings
    const keptIds = formData.btn1AffiliateRules.map(r => String(r.affiliateId || '').trim()).filter(Boolean);
    const lostIds = savedAffiliateIds.current.filter(id => !keptIds.includes(id) && id !== savedDefaultTag.current);
    if (lostIds.length && !window.confirm(`The affiliate id${lostIds.length === 1 ? '' : 's'} ${lostIds.join(', ')} ${lostIds.length === 1 ? 'is' : 'are'} no longer used by any tag. Saving deletes ${lostIds.length === 1 ? 'its' : 'their'} click and visitor counts. Continue?`)) return; // round 6
    setSaveState('saving');
    const payload = {
      tags: formData.btn1AffiliateRules.map(r => ({
        id: String(r.id),
        nickname: r.nickname || '',
        affiliate_id: r.affiliateId || '',
        domain: r.domain,
        enabled: r.enabled !== false,
        mode: r.mode === 'rules' ? 'rules' : 'sitewide',
        rules: ruleValuesToRules(r.ruleValues),
      })),
      link_options: {
        rel: formData.btn1FollowMode === 'follow' ? 'follow' : 'nofollow',
        sponsored: !!formData.btn1Sponsored,
        new_tab: !!formData.btn1OpenInNewTab,
      },
      default_tag: savedDefaultTag.current,
      geo_enabled: !!formData.geoEnabled,
      exclusions: exclusionsToBackend(formData.globalExclusions, formData.globalExcludedTrees, formData.globalExceptions),
      button: {
        text: formData.btn1Text,
        link_mode: formData.btn1LinkMode === 'custom' ? 'custom' : 'generated',
        custom_link: formData.btn1Link,
        generated_domain: formData.btn1GeneratedDomain,
        skip_tag: !!formData.btn1SkipTag,
      },
      auto_linker: {
        enabled: !!formData.autoLinkerEnabled,
        limit: parseInt(formData.autoLinkerLimit, 10) || 2,
        apply: {
          posts: !!formData.autoLinkerApplyPosts,
          pages: !!formData.autoLinkerApplyPages,
          products: !!formData.autoLinkerApplyProducts,
        },
        skip: {
          headings: !!formData.autoLinkerSkipHeadings,
          links: !!formData.autoLinkerSkipLinks,
          code: !!formData.autoLinkerSkipCode,
          first_paragraph: !!formData.autoLinkerSkipFirstParagraph,
          blockquotes: !!formData.autoLinkerSkipBlockquotes,
        },
        rules: formData.autoLinkerRules.map(r => ({
          id: String(r.id),
          nickname: r.nickname || '',
          keywords: r.keywords || '',
          link: r.link || '',
          tag: r.tag || '',
          match_type: r.matchType === 'broad' ? 'broad' : 'exact',
          case_sensitive: !!r.caseSensitive,
          max_links: (r.maxLinks === '' || r.maxLinks == null) ? 0 : (parseInt(r.maxLinks, 10) || 0),
          first_match_only: !!r.firstMatchOnly,
          enabled: r.enabled !== false,
        })),
      },
      scan_frequency: parseInt(formData.scanFrequency, 10) || 7,
      scan_frequency_unit: formData.scanFrequencyUnit === 'hours' ? 'hours' : 'days',
      scan_auto: !!formData.scanAuto,
      monitor: {
        oos_to_search: !!formData.monitorOosToSearch,
        dead_to_search: !!formData.monitorDeadToSearch,
        oos_mode: formData.monitorOosMode === 'search' ? 'search' : 'replacement',
        dead_mode: formData.monitorDeadMode === 'search' ? 'search' : 'replacement',
      },
      mobile_app: {
        enabled: !!formData.enabled,
        ios_safari_button: !!formData.iosOpenInSafari,
        android_mode: formData.androidMode === 'intent' ? 'intent' : 'browser',
      },
      click_protection: {
        block_bots: !!formData.blockBots,
        redirect_method: ['js_302', 'js', '302'].includes(formData.redirectMethod) ? formData.redirectMethod : 'js_302',
      },
    };
    fetch(cfg.rest + 'settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': cfg.nonce },
      body: JSON.stringify(payload),
    })
      .then(r => { if (!r.ok) throw new Error('save failed'); return r.json(); })
      .then(d => { if (!d || d.saved !== true) throw new Error('save not confirmed'); savedAffiliateIds.current = keptIds; setSaveState('saved'); setTimeout(() => setSaveState('idle'), 2000); }) // the server says saved only after a read-back (round 1)
      .catch(() => { setSaveState('error'); setTimeout(() => setSaveState('idle'), 3000); });
  }, [formData, loaded]);

  // Suite integration: when PI's sticky Save Changes button fires, save AM's data in parallel.
  useEffect(() => {
    if (!suiteMode) return;
    const handler = () => handleSave();
    window.addEventListener('devdome-suite-save', handler);
    return () => window.removeEventListener('devdome-suite-save', handler);
  }, [suiteMode, handleSave]);

  // --- Auto-linker rules: import / export (JSON, client-side) ---
  const autoLinkerImportRef = useRef(null);
  const handleExportRules = useCallback(() => {
    const data = formData.autoLinkerRules.map(({ id, clicks, isBroken, ...r }) => r);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'auto-linker-rules.json'; a.click();
    URL.revokeObjectURL(url);
  }, [formData.autoLinkerRules]);
  const handleImportRules = useCallback((e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) return;
        const rules = parsed.map((r, i) => ({
          id: Date.now() + i,
          nickname: r.nickname || '', keywords: r.keywords || '', link: r.link || '',
          tag: r.tag || '', matchType: r.matchType === 'broad' ? 'broad' : 'exact',
          caseSensitive: !!r.caseSensitive, maxLinks: r.maxLinks || '', firstMatchOnly: !!r.firstMatchOnly,
          enabled: r.enabled !== false, clicks: 0, isBroken: false,
        }));
        if (!rules.length) { window.alert('The file holds no rules.'); return; }
        setFormData(prev => {
          if (prev.autoLinkerRules.length && !window.confirm(`Replace your ${prev.autoLinkerRules.length} current rule${prev.autoLinkerRules.length === 1 ? '' : 's'} with the ${rules.length} from the file? Their click counts go once you save.`)) return prev;
          return { ...prev, autoLinkerRules: rules };
        });
      } catch (err) { window.alert('The file is not a valid rules export.'); }
    };
    reader.readAsText(file);
  }, []);

  useEffect(() => { if (showTagSearch && globalTagSearchRef.current) globalTagSearchRef.current.focus(); }, [showTagSearch]);
  useEffect(() => { if (showAutoLinkerSearch && globalAutoLinkerSearchRef.current) globalAutoLinkerSearchRef.current.focus(); }, [showAutoLinkerSearch]);
  useEffect(() => { if (showExclusionSearch && exclusionSearchRef.current) exclusionSearchRef.current.focus(); }, [showExclusionSearch]);

  // Prevent background scrolling when exclusions modal is open
  useEffect(() => {
    if (exclusionModalType) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
    return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    };
  }, [exclusionModalType]);

  const handleCloseModal = useCallback(() => {
    setExclusionModalType(null);
    setExclusionSelectedItems([]);
    setExclusionSearch('');
    setShowExclusionSearch(false);
    setExclusionCurrentPage(1);
    setExclusionTypeFilter('All');
    setExclusionLastSelected(null);
  }, []);
  
  const handleScanSite = useCallback(() => {
      const cfg = window.DEVDAFFI_ADMIN;
      if (!cfg) return;
      setScanState('scanning');
      fetch(cfg.rest + 'scan', { method: 'POST', headers: { 'X-WP-Nonce': cfg.nonce } })
        .then(r => r.json().then(d => ({ ok: r.ok, d })))
        .then(({ ok, d }) => {
          if (ok && d && d.ok === true) { // a scan that could not read its sources answers an error, never counts (round 1)
            setAmazonLinksFound(d.links || 0);
            setScanPages(d.pages || 0);
            setHasScannedSite(true);
            setScanState('done');
            if (d.partial) window.alert('The site has more posts mentioning Amazon than one scan covers (20,000). The index was updated for the posts scanned; nothing was pruned.');
          } else {
            setScanState('idle');
            window.alert((d && d.message) || 'The scan could not complete. The index was left as it was.');
          }
        })
        .catch(() => { setScanState('idle'); window.alert('The scan could not complete. The index was left as it was.'); });
  }, []);

  const handleResetBots = useCallback(() => {
      const cfg = window.DEVDAFFI_ADMIN;
      if (!cfg) return;
      if (!window.confirm('Reset the blocked-bot counter to zero? This cannot be undone.')) return; // round 2
      fetch(cfg.rest + 'reset-bots', { method: 'POST', headers: { 'X-WP-Nonce': cfg.nonce } })
        .then(r => r.json().then(d => ({ ok: r.ok, d })))
        .then(({ ok, d }) => { if (ok && d && typeof d.bots_blocked === 'number') setBotsBlocked(d.bots_blocked); else window.alert((d && d.message) || 'The counter could not be reset.'); }) // the count follows the server, never an optimistic 0 (round 1)
        .catch(() => window.alert('The counter could not be reset.'));
  }, []);

  // Reset clicks on a tag or rule row: the server deletes the click row and answers only when it is gone (round 1:
  // the icon used to zero the number on screen and the next load brought it back).
  const handleResetRowClicks = useCallback((key, apply) => {
      const cfg = window.DEVDAFFI_ADMIN;
      if (!cfg || !key) return;
      if (!window.confirm('Reset the click and visitor counts of this row? This cannot be undone.')) return;
      fetch(cfg.rest + 'reset-clicks', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': cfg.nonce }, body: JSON.stringify({ key }) })
        .then(r => r.json().then(d => ({ ok: r.ok, d })))
        .then(({ ok, d }) => { if (ok && d && d.clicks === 0) apply(); else window.alert((d && d.message) || 'The clicks could not be reset.'); })
        .catch(() => window.alert('The clicks could not be reset.'));
  }, []);

  // Bulk-replace a dead/OOS ASIN with a new one across every page that links it.
  const handleReplace = useCallback((oldAsin, pageCount) => {
      const cfg = window.DEVDAFFI_ADMIN;
      const next = (replaceVal[oldAsin] || '').trim().toUpperCase();
      if (!cfg || next.length !== 10 || next === oldAsin) return;
      const n = typeof pageCount === 'number' ? pageCount : 0;
      if (!window.confirm(`Replace ${oldAsin} with ${next} in ${n} page${n === 1 ? '' : 's'}? The content of every linking post is rewritten; the previous version is kept in a recovery journal only until each post is verified, then it is gone. The new ASIN is then checked with DevDome (uses your quota).`)) return;
      setReplaceBusy(oldAsin);
      fetch(cfg.rest + 'replace', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': cfg.nonce }, body: JSON.stringify({ old: oldAsin, new: next }) })
        .then(r => r.json().then(d => ({ ok: r.ok, d })))
        .then(({ ok, d }) => {
          if (!ok || !d || d.ok !== true) { window.alert((d && d.message) || 'The replacement could not be completed.'); return; } // a partial replacement is named, never shown as done (round 1)
          if (d.summary) { setMonitorSummary(d.summary); setMonitorProblems(d.problems || []); setMonitorHasMore(!!d.has_more); }
          setReplaceUnfinished(Array.isArray(d.unfinished) ? d.unfinished : []);
          if (d.service_state && d.service_state !== 'ok') window.alert('The links were replaced, but DevDome did not check the new ASIN (' + d.service_state + '). Run Check now later.'); // round 6
          setReplaceVal(v => { const c = { ...v }; delete c[oldAsin]; return c; });
        })
        .catch(() => window.alert('The replacement could not be completed.'))
        .finally(() => setReplaceBusy(null));
  }, [replaceVal]);

  // Live row lazy-loads via /monitor/by-status?status=ok. append=true paginates ("Show more").
  const loadLive = useCallback((append) => {
      const cfg = window.DEVDAFFI_ADMIN;
      if (!cfg) return;
      setLiveState(s => {
        const offset = append ? s.offset : 0;
        fetch(restQuery(cfg.rest, 'monitor/by-status', 'status=ok&limit=50&offset=' + offset), { headers: { 'X-WP-Nonce': cfg.nonce } })
          .then(r => r.json().then(d => ({ ok: r.ok, d })))
          .then(({ ok, d }) => {
            if (!ok || !d || !Array.isArray(d.items)) { setLiveState(prev => ({ ...prev, loading: false })); window.alert((d && d.message) || 'The live list could not be read.'); return; } // round 3
            const newItems = d.items;
            setLiveState(prev => ({
              items: append ? [...prev.items, ...newItems] : newItems,
              loading: false,
              offset: offset + newItems.length,
              hasMore: !!(d && d.has_more),
              loaded: true,
            }));
          })
          .catch(() => setLiveState(prev => ({ ...prev, loading: false })));
        return { ...s, loading: true };
      });
  }, []);

  // status: 'oos' | 'dead' re-checks only that group (fixed ones flip back to Live);
  // omitted runs a normal batch check.
  const runMonitor = useCallback((status) => {
      const cfg = window.DEVDAFFI_ADMIN;
      if (!cfg) return;
      const isStatus = status === 'oos' || status === 'dead';
      if (isStatus) setMonitorRefresh(status); else setMonitorState('checking');
      const url = cfg.rest + 'monitor' + (isStatus ? '?status=' + status : '');
      fetch(url, { method: 'POST', headers: { 'X-WP-Nonce': cfg.nonce } })
        .then(r => r.json().then(d => ({ ok: r.ok, d })))
        .then(({ ok, d }) => {
          if (!ok || !d || d.ok !== true || !d.summary) { window.alert((d && d.message) || 'The check could not run.'); return; } // rounds 2-4: a failed or partial check is said, never shown as a clean state
          setMonitorSummary(d.summary); setMonitorProblems(d.problems || []); setMonitorHasMore(!!d.has_more);
          const st = d.service_state;
          if (st === 'connect') window.alert('DevDome refused the check: connect this site to a DevDome account first. Nothing was checked.');
          else if (st === 'quota') window.alert('The monthly Link Radar quota of your account is used up. Nothing was checked.');
          else if (st === 'unavailable') window.alert('DevDome did not answer; nothing was checked and no status was changed.');
        })
        .catch(() => window.alert('The check could not run.'))
        .finally(() => { if (isStatus) setMonitorRefresh(null); else setMonitorState('idle'); });
  }, []);

  const handleAddAutoLinkRule = useCallback(() => {
    const newId = Date.now();
    setFormData(prev => {
      const defaultTagId = prev.btn1AffiliateRules.length > 0 ? prev.btn1AffiliateRules[0].id : '';
      return {
        ...prev,
        autoLinkerRules: [...prev.autoLinkerRules, { id: newId, keywords: '', link: '', enabled: true, tag: `tag-${defaultTagId}`, nickname: '', clicks: 0, isBroken: false, matchType: 'exact', caseSensitive: false, maxLinks: '', firstMatchOnly: false }]
      };
    });
    setTimeout(() => {
        const newEl = document.getElementById(`autolink-rule-${newId}`);
        if (newEl) newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, []);

  const handleRemoveAutoLinkRule = useCallback((id, e) => {
    if (!window.confirm('Remove this rule? Its auto-links stop and its click counts are deleted once you save settings.')) return; // round 2
    const btnRect = e?.currentTarget?.getBoundingClientRect();
    const targetY = btnRect ? btnRect.top : null;
    setFormData(prev => {
      const rules = prev.autoLinkerRules;
      const idx = rules.findIndex(r => r.id === id);
      if (idx === -1) return prev;
      const targetRule = rules[idx + 1] || rules[idx - 1];
      if (targetY !== null && targetRule) {
          setTimeout(() => {
              const newBtn = document.querySelector(`#autolink-rule-${targetRule.id} button[title="Delete Rule"]`);
              if (newBtn) {
                  const scrollDiff = newBtn.getBoundingClientRect().top - targetY;
                  if (scrollDiff !== 0) window.scrollBy({ top: scrollDiff, behavior: 'instant' });
              }
          }, 10); 
      }
      return { ...prev, autoLinkerRules: rules.filter(rule => rule.id !== id) };
    });
  }, []);

  const handleAutoLinkerDragStart = useCallback((e, index) => { setAutoLinkerDraggedRuleIdx(index); e.dataTransfer.effectAllowed = "move"; e.currentTarget.style.opacity = '0.4'; }, []);
  const handleAutoLinkerDragEnter = useCallback((e, index) => { e.preventDefault(); setAutoLinkerDragOverRuleIdx(prev => prev !== index ? index : prev); }, []);
  const handleAutoLinkerDragEnd = useCallback((e) => { e.currentTarget.style.opacity = '1'; setAutoLinkerDraggedRuleIdx(null); setAutoLinkerDragOverRuleIdx(null); setAutoLinkerDragEnabledId(null); }, []);
  
  const handleAutoLinkerDrop = useCallback((e, dropIndex) => {
      e.preventDefault();
      setAutoLinkerDraggedRuleIdx(draggedIdx => {
          if (draggedIdx === null || draggedIdx === dropIndex) return null;
          setFormData(prev => {
              const newRules = [...prev.autoLinkerRules];
              const draggedItem = newRules[draggedIdx];
              newRules.splice(draggedIdx, 1);
              newRules.splice(dropIndex, 0, draggedItem);
              return { ...prev, autoLinkerRules: newRules };
          });
          return null;
      });
      setAutoLinkerDragOverRuleIdx(null); setAutoLinkerDragEnabledId(null);
  }, []);

  const handleAutoLinkRuleChange = useCallback((id, field, value) => {
    setFormData(prev => ({
      ...prev,
      autoLinkerRules: prev.autoLinkerRules.map(rule => rule.id === id ? { ...rule, [field]: value } : rule)
    }));
  }, []);

  const handleDuplicateAutoLinkRule = useCallback((id) => {
      const newId = Date.now();
      setFormData(prev => {
          const ruleIndex = prev.autoLinkerRules.findIndex(r => r.id === id);
          if (ruleIndex === -1) return prev;
          const newRule = { ...prev.autoLinkerRules[ruleIndex], id: newId, clicks: 0 }; // a new id has no clicks (round 6)
          const newRules = [...prev.autoLinkerRules];
          newRules.splice(ruleIndex + 1, 0, newRule);
          return { ...prev, autoLinkerRules: newRules };
      });
      setTimeout(() => {
          const newEl = document.getElementById(`autolink-rule-${newId}`);
          if (newEl) newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
  }, []);

  const handleAddRule = useCallback((btnNumber) => {
    const field = `btn${btnNumber}AffiliateRules`;
    const newRuleId = Date.now();
    setFormData(prev => {
      const rules = prev[field];
      if (rules.length >= 100) { window.alert('You can add up to 100 Amazon tags.'); return prev; } // round 2: the copy's limit, enforced
      const lastDomain = rules.length > 0 ? rules[rules.length - 1].domain : 'amazon.com';
      const hasSitewide = rules.some(r => r.domain === lastDomain && r.mode === 'sitewide');
      return { ...prev, [field]: [...rules, { id: newRuleId, affiliateId: '', domain: lastDomain, mode: hasSitewide ? 'rules' : 'sitewide', enabled: true, nickname: '', ruleValues: [], clicks: 0 }] };
    });
    setTimeout(() => {
        const newTagElement = document.getElementById(`tag-rule-${newRuleId}`);
        if (newTagElement) newTagElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, []);

  const handleRemoveRule = useCallback((btnNumber, id, e) => {
    if (!window.confirm('Remove this tag? Links stop being tagged with it and its click counts are deleted once you save settings.')) return; // round 2
    const btnRect = e?.currentTarget?.getBoundingClientRect();
    const targetY = btnRect ? btnRect.top : null;
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData(prev => {
      const rules = prev[field];
      const idx = rules.findIndex(r => r.id === id);
      if (idx === -1) return prev;
      const targetRule = rules[idx + 1] || rules[idx - 1];
      if (targetY !== null && targetRule) {
          setTimeout(() => {
              const newBtn = document.querySelector(`#tag-rule-${targetRule.id} button[title="Delete Tag"]`);
              if (newBtn) {
                  const scrollDiff = newBtn.getBoundingClientRect().top - targetY;
                  if (scrollDiff !== 0) window.scrollBy({ top: scrollDiff, behavior: 'instant' });
              }
          }, 10); 
      }
      const remaining = rules.filter(rule => rule.id !== id);
      const fallbackTag = remaining.length ? `tag-${remaining[0].id}` : '';
      const autoLinkerRules = (prev.autoLinkerRules || []).map(r => (r.tag === `tag-${id}` ? { ...r, tag: fallbackTag } : r)); // rounds 6-7: a rule that pointed at a removed tag gets the first remaining tag, exactly what the dropdown shows
      return { ...prev, [field]: rules.filter(rule => rule.id !== id), autoLinkerRules };
    });
  }, []);

  const handleDragStart = useCallback((e, index) => { setDraggedRuleIdx(index); e.dataTransfer.effectAllowed = "move"; e.currentTarget.style.opacity = '0.4'; }, []);
  const handleDragEnter = useCallback((e, index) => { e.preventDefault(); setDragOverRuleIdx(prev => prev !== index ? index : prev); }, []);
  const handleDragEnd = useCallback((e) => { e.currentTarget.style.opacity = '1'; setDraggedRuleIdx(null); setDragOverRuleIdx(null); setDragEnabledId(null); }, []);

  const handleDrop = useCallback((e, dropIndex) => {
      e.preventDefault();
      setDraggedRuleIdx(draggedIdx => {
          if (draggedIdx === null || draggedIdx === dropIndex) return null;
          setFormData(prev => {
              const field = 'btn1AffiliateRules';
              const newRules = [...prev[field]];
              const draggedItem = newRules[draggedIdx];
              newRules.splice(draggedIdx, 1);
              newRules.splice(dropIndex, 0, draggedItem);
              return { ...prev, [field]: newRules };
          });
          return null;
      });
      setDragOverRuleIdx(null); setDragEnabledId(null);
  }, []);

  const handleRuleChange = useCallback((btnNumber, id, key, value) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData(prev => {
      let updatedRules = prev[field].map(rule => rule.id === id ? { ...rule, [key]: value } : rule);
      if (key === 'domain') {
        const hasSitewide = updatedRules.some(r => r.id !== id && r.domain === value && r.mode === 'sitewide');
        updatedRules = updatedRules.map(rule => rule.id === id ? { ...rule, mode: hasSitewide ? 'rules' : 'sitewide' } : rule);
      } else if (key === 'mode' && value === 'sitewide') {
        const modifiedRule = updatedRules.find(r => r.id === id);
        if (modifiedRule) updatedRules = updatedRules.map(rule => (rule.id !== id && rule.domain === modifiedRule.domain && rule.mode === 'sitewide') ? { ...rule, mode: 'rules' } : rule);
      }
      return { ...prev, [field]: updatedRules };
    });
  }, []);

  const toggleExclusion = useCallback((item, mode = 'url') => {
    setFormData(prev => {
        // Excluding a target drops it from every tag's rule list (round 3): say so before it happens.
        const affected = mode === 'tree' ? [item.value, ...targetOptions.filter(t => t.parentCategory === item.value).map(t => t.value)] : [item.value];
        const assigned = (prev.btn1AffiliateRules || []).some(r => (r.ruleValues || []).some(v => affected.includes(v))); // round 4: a child of the category counts too
        const excluding = (mode === 'url' && !(prev.globalExclusions || []).includes(item.value)) || (mode === 'tree' && !(prev.globalExcludedTrees || []).includes(item.value));
        if (assigned && excluding && !window.confirm('This target is assigned to a tag rule. Excluding it removes it from those rules (not restored when you un-exclude). Continue?')) return prev;
        let exclusions = [...(prev.globalExclusions || [])];
        let excludedTrees = [...(prev.globalExcludedTrees || [])];
        let exceptions = [...(prev.globalExceptions || [])];
        let rules = [...prev.btn1AffiliateRules];

        if (mode === 'tree') {
            if (excludedTrees.includes(item.value)) {
                excludedTrees = excludedTrees.filter(v => v !== item.value);
                exclusions = exclusions.filter(v => v !== item.value);
                exceptions = exceptions.filter(v => v !== item.value);
                const children = targetOptions.filter(t => t.parentCategory === item.value).map(t => t.value);
                exceptions = exceptions.filter(v => !children.includes(v)); // Clean exceptions for restored children
            } else {
                excludedTrees.push(item.value);
                if (!exclusions.includes(item.value)) exclusions.push(item.value); // Implicitly exclude the URL
                const children = targetOptions.filter(t => t.parentCategory === item.value).map(t => t.value);
                exceptions = exceptions.filter(v => !children.includes(v));
                rules = rules.map(r => ({ ...r, ruleValues: (r.ruleValues || []).filter(v => v !== item.value && !children.includes(v)) }));
            }
        } else if (mode === 'url') {
            if (exclusions.includes(item.value)) {
                exclusions = exclusions.filter(v => v !== item.value);
                if (excludedTrees.includes(item.value) || (item.parentCategory && excludedTrees.includes(item.parentCategory))) {
                    if (!exceptions.includes(item.value)) exceptions.push(item.value); // Add exception if tree is still blocked
                }
            } else {
                exclusions.push(item.value);
                exceptions = exceptions.filter(v => v !== item.value);
                rules = rules.map(r => ({ ...r, ruleValues: (r.ruleValues || []).filter(v => v !== item.value) }));
            }
        } else if (mode === 'exception') {
            if (exceptions.includes(item.value)) {
                exceptions = exceptions.filter(v => v !== item.value);
                rules = rules.map(r => ({ ...r, ruleValues: (r.ruleValues || []).filter(v => v !== item.value) }));
            } else {
                exceptions.push(item.value);
            }
        } else if (mode === 'exception_tree') {
            const children = targetOptions.filter(t => t.parentCategory === item.value).map(t => t.value);
            const allVals = [item.value, ...children];
            const allExceptions = allVals.every(v => exceptions.includes(v));
            if (allExceptions) {
                exceptions = exceptions.filter(v => !allVals.includes(v));
                rules = rules.map(r => ({ ...r, ruleValues: (r.ruleValues || []).filter(v => !allVals.includes(v)) }));
            } else {
                allVals.forEach(v => { if (!exceptions.includes(v)) exceptions.push(v); });
            }
        }
        
        return { ...prev, globalExclusions: exclusions, globalExcludedTrees: excludedTrees, globalExceptions: exceptions, btn1AffiliateRules: rules };
    });
  }, []);

  const handleRestoreExcluded = useCallback((val, mode) => {
      setFormData(prev => {
          const exclusions = new Set(prev.globalExclusions || []);
          const excludedTrees = new Set(prev.globalExcludedTrees || []);
          const exceptions = new Set(prev.globalExceptions || []);
          
          if (mode === 'tree') {
              excludedTrees.delete(val);
              exclusions.delete(val);
              exceptions.delete(val);
              const children = targetOptions.filter(t => t.parentCategory === val).map(t => t.value);
              children.forEach(child => exceptions.delete(child));
          } else if (mode === 'url') {
              exclusions.delete(val);
              if (excludedTrees.has(val) || (targetOptions.find(t => t.value === val)?.parentCategory && excludedTrees.has(targetOptions.find(t => t.value === val).parentCategory))) {
                  exceptions.add(val);
              }
          } else if (mode === 'exception') {
              exceptions.add(val);
          } else if (mode === 'exception_tree') {
              exceptions.add(val);
              targetOptions.filter(t => t.parentCategory === val).forEach(child => exceptions.add(child.value));
          }
          
          return { ...prev, globalExclusions: [...exclusions], globalExcludedTrees: [...excludedTrees], globalExceptions: [...exceptions] };
      });
  }, []);

  const handleRuleTargetAdd = useCallback((btnNumber, ruleId, value) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData(prev => ({ ...prev, [field]: prev[field].map(rule => rule.id === ruleId ? { ...rule, ruleValues: Array.from(new Set([...(rule.ruleValues || []), value])) } : rule) }) );
  }, []);

  const handleRuleTargetBulkAdd = useCallback((btnNumber, ruleId, values) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData(prev => ({ ...prev, [field]: prev[field].map(rule => rule.id === ruleId ? { ...rule, ruleValues: Array.from(new Set([...(rule.ruleValues || []), ...values])) } : rule) }));
  }, []);

  const handleRuleTargetRemove = useCallback((btnNumber, ruleId, valueToRemove) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData(prev => ({ ...prev, [field]: prev[field].map(rule => rule.id === ruleId ? { ...rule, ruleValues: rule.ruleValues.filter(v => v !== valueToRemove) } : rule) }));
  }, []);
  
  const handleRuleTargetClearAll = useCallback((btnNumber, ruleId) => {
    if (!window.confirm('Remove every target from this tag rule? They are gone once you save settings.')) return; // round 4
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData(prev => ({ ...prev, [field]: prev[field].map(rule => rule.id === ruleId ? { ...rule, ruleValues: [] } : rule) }));
  }, []);

  const handleRuleTargetBulkRemove = useCallback((btnNumber, ruleId, valuesToRemove) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData(prev => ({ ...prev, [field]: prev[field].map(rule => rule.id === ruleId ? { ...rule, ruleValues: rule.ruleValues.filter(v => !valuesToRemove.includes(v)) } : rule) }));
  }, []);

  const handleTransferRuleTarget = useCallback((btnNumber, value, fromRuleId, toRuleId) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map(rule => {
        if (rule.id === fromRuleId) return { ...rule, ruleValues: rule.ruleValues.filter(v => v !== value) };
        if (rule.id === toRuleId) return { ...rule, ruleValues: Array.from(new Set([...(rule.ruleValues || []), value])) };
        return rule;
      })
    }));
  }, []);

  // Exclusions Modal Data logic.
  // 'all' tab → server search (scales to any site); 'excluded' tab → the finite
  // set of already-excluded items, resolved into the cache, filtered client-side.
  const [modalSrv, setModalSrv] = useState({ items: [], counts: {}, total: 0 });
  useEffect(() => {
      const cfg = typeof window !== 'undefined' && window.DEVDAFFI_ADMIN;
      if (!cfg || !exclusionModalType || exclusionTab === 'excluded') return;
      const ctrl = new AbortController();
      const h = setTimeout(() => {
          const url = `${cfg.rest}content?q=${encodeURIComponent(exclusionSearch)}&type=${encodeURIComponent(exclusionTypeFilter)}&page=${exclusionCurrentPage}`;
          fetch(url, { headers: { 'X-WP-Nonce': cfg.nonce }, signal: ctrl.signal })
            .then(r => r.json())
            .then(d => { if (!d || !Array.isArray(d.items)) return; cacheItems(d.items); setModalSrv({ items: d.items, counts: d.counts || {}, total: d.total || d.items.length }); })
            .catch(() => {});
      }, 250);
      return () => { clearTimeout(h); ctrl.abort(); };
  }, [exclusionModalType, exclusionTab, exclusionSearch, exclusionTypeFilter, exclusionCurrentPage]);

  const modalData = useMemo(() => {
      const isWP = typeof window !== 'undefined' && !!window.DEVDAFFI_ADMIN;
      const SERVER_PER = 50;

      if (isWP && exclusionTab !== 'excluded') {
          const c = modalSrv.counts || {};
          const tabCounts = { "All": c.All || 0, "Page": c.Page || 0, "Post Category": c["Post Category"] || 0, "Post": c.Post || 0, "Product Category": 0, "Product": 0 };
          const totalItems = modalSrv.total;
          const totalPages = Math.max(1, Math.ceil(totalItems / SERVER_PER));
          const safePage = Math.min(Math.max(1, exclusionCurrentPage), totalPages);
          const startIndex = (safePage - 1) * SERVER_PER;
          const endIndex = Math.min(startIndex + modalSrv.items.length, totalItems);
          return { currentItems: modalSrv.items, tabCounts, totalItems, totalPages, safePage, startIndex, endIndex, hasMatches: modalSrv.items.length > 0 };
      }

      const baseOptions = exclusionTab === 'excluded'
          ? targetOptions.filter(opt =>
              (formData.globalExclusions || []).includes(opt.value) ||
              (formData.globalExcludedTrees || []).includes(opt.value) ||
              (opt.parentCategory && (formData.globalExcludedTrees || []).includes(opt.parentCategory) && !(formData.globalExceptions || []).includes(opt.value))
            )
          : targetOptions;

      const matchedItems = getFilteredData(baseOptions, exclusionSearch, exclusionTypeFilter);
      const allMatched = getFilteredData(baseOptions, exclusionSearch, "All");
      const tabCounts = getTabCounts(allMatched);

      const totalItems = matchedItems.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / exclusionItemsPerPage));
      const safePage = Math.min(Math.max(1, exclusionCurrentPage), totalPages);
      const startIndex = (safePage - 1) * exclusionItemsPerPage;
      const endIndex = Math.min(startIndex + exclusionItemsPerPage, totalItems);
      const currentItems = matchedItems.slice(startIndex, endIndex);

      return { currentItems, tabCounts, totalItems, totalPages, safePage, startIndex, endIndex, hasMatches: matchedItems.length > 0 };
  }, [modalSrv, exclusionSearch, exclusionTab, exclusionTypeFilter, formData.globalExclusions, formData.globalExcludedTrees, formData.globalExceptions, exclusionCurrentPage, exclusionItemsPerPage]);

  const { grouped, sortedTypes } = useMemo(() => {
      const grp = modalData.currentItems.reduce((acc, opt) => { 
          if (!acc[opt.type]) acc[opt.type] = []; 
          acc[opt.type].push(opt); 
          return acc; 
      }, {});
      const sorted = Object.keys(grp).sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));
      return { grouped: grp, sortedTypes: sorted };
  }, [modalData.currentItems]);

  const handleRadioChange = useCallback((name, value) => setFormData(prev => ({ ...prev, [name]: value })), []);
  const handleCheckboxChange = useCallback((e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.checked })), []);
  const handleChange = useCallback((e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })), []);

  const applyToCount = (formData.autoLinkerApplyPosts ? 1 : 0) + (formData.autoLinkerApplyPages ? 1 : 0) + (formData.autoLinkerApplyProducts ? 1 : 0);
  const skipRulesCount = (formData.autoLinkerSkipHeadings ? 1 : 0) + (formData.autoLinkerSkipLinks ? 1 : 0) + (formData.autoLinkerSkipCode ? 1 : 0) + (formData.autoLinkerSkipFirstParagraph ? 1 : 0) + (formData.autoLinkerSkipBlockquotes ? 1 : 0);

  const displayedAutoLinkerRules = useMemo(() => {
     const rules = formData.autoLinkerRules.map((r, i) => ({...r, _origIdx: i}));
     if (autoLinkerSortOrder === 1) rules.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
     if (autoLinkerSortOrder === 2) rules.sort((a, b) => (a.clicks || 0) - (b.clicks || 0));
     return rules;
  }, [formData.autoLinkerRules, autoLinkerSortOrder]);

  const displayedTags = useMemo(() => {
     const rules = formData.btn1AffiliateRules.map((r, i) => ({...r, _origIdx: i}));
     if (tagSortOrder === 1) rules.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
     if (tagSortOrder === 2) rules.sort((a, b) => (a.clicks || 0) - (b.clicks || 0));
     return rules;
  }, [formData.btn1AffiliateRules, tagSortOrder]);

  const globalAllRulesList = useMemo(() => {
      return formData.btn1AffiliateRules.map((r, i) => ({ id: r.id, index: i + 1, nickname: r.nickname, domain: r.domain, affiliateId: r.affiliateId }));
  }, [formData.btn1AffiliateRules]);

  // Gate the whole tree on settings being loaded — otherwise the form briefly renders with
  // default formData (looks like "broken tables" in PI's Link Control suite-mode slot).
  if (!loaded) {
    return (
      <div className={suiteMode ? 'flex items-center justify-center min-h-[200px] font-sans' : 'min-h-screen flex items-center justify-center bg-gray-50 font-sans'}>
        {loadError ? (
          <div className="text-center max-w-md px-6">
            <div className="text-[14px] font-semibold text-gray-800 mb-2">The settings could not be loaded.</div>
            <div className="text-[13px] text-gray-600 mb-4">Nothing was changed. If it keeps happening, check the database with your host.</div>
            <button type="button" onClick={() => window.location.reload()} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold rounded-lg">Retry</button>
          </div>
        ) : (
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
        )}
      </div>
    );
  }

  return (
    <div className={suiteMode ? 'font-sans' : 'min-h-screen bg-gray-50 font-sans'}>
      {/* Main plugin header (standalone only; the PI suite renders its own): full-width white
          bar with the gradient icon, title and bug-report button — the exact layout the other
          DevDome plugins (SMC / Analytics / RM) use. */}
      {!suiteMode && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl px-6 py-4 flex items-center gap-3">
            <div className="p-1.5 rounded text-white inline-flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}><Percent size={20} /></div>
            <h1 className="text-xl font-bold text-gray-800 m-0">DevDome Affiliate Manager</h1>
            <a
              href={(window.DEVDAFFI_ADMIN && window.DEVDAFFI_ADMIN.bug) || 'https://devdome.com/report-bug?plugin=devdome-affiliate-manager'}
              target="_blank" rel="noopener noreferrer" title="Report a bug"
              className="ml-auto w-9 h-9 rounded-full border border-gray-300 bg-white grid place-items-center text-gray-500 hover:text-blue-700 hover:border-blue-600 transition-colors no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>
            </a>
          </div>
        </div>
      )}
      <div className={suiteMode ? '' : ''}>
      <div className={suiteMode ? 'w-full' : 'max-w-5xl px-6 pt-3 pb-6'}>
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        `}} />

        {/* Standalone: no outer "window" card — sections sit directly on the grey page,
            exactly like Redirect Manager / SMC. The card + dividers only ever made sense
            inside the old boxed layout. */}
        <div className="bg-transparent">
          <form className={suiteMode ? 'divide-y divide-gray-100' : ''} onSubmit={(e) => e.preventDefault()}>

            {/* --- Link Setup Section --- */}
            <div className={suiteMode ? '' : 'py-6'}>
              <Section title="Link Setup" icon={Link}>
                 <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                    <div className="space-y-8 animate-in fade-in duration-300">
                        
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
                                <div className="flex items-center gap-2 mt-1.5">
                                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                        Affiliate Tags
                                        {tagsExpanded && (
                                            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] leading-none flex items-center justify-center min-w-[18px] h-[18px]">
                                                {formData.btn1AffiliateRules.length}
                                            </span>
                                        )}
                                    </h3>
                                    <InfoTooltip text="Only full Amazon domain links are supported (e.g. amazon.com, amazon.de). Shortened links like amzn.to or a.co are not supported. You can add up to 100 Amazon tags." />
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-2">
                                    <div className="flex items-center gap-2 flex-wrap justify-end">
                                        {showTagSearch ? (
                                           <div className="relative animate-in fade-in zoom-in-95 duration-200 flex items-center shrink-0">
                                              <input 
                                                 ref={globalTagSearchRef}
                                                 type="text" 
                                                 value={tagSearchQuery} 
                                                 onChange={e => setTagSearchQuery(e.target.value)} 
                                                 placeholder="Search tags..." 
                                                 className="pl-7 pr-7 py-1 text-xs font-semibold text-gray-700 border border-gray-200 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-[130px] h-8"
                                              />
                                              <Search size={13} className="absolute left-2.5 top-2.5 text-indigo-400 pointer-events-none" />
                                              <button type="button" onClick={() => {setShowTagSearch(false); setTagSearchQuery('');}} className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"><X size={13}/></button>
                                           </div>
                                        ) : (
                                           <button 
                                               type="button" 
                                               onClick={() => { setShowTagSearch(true); setTagsExpanded(true); }}
                                               className="flex items-center justify-center p-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm h-8"
                                               title="Search Tags"
                                           >
                                               <Search size={14} className="text-indigo-500" />
                                           </button>
                                        )}

                                        <button 
                                            type="button" 
                                            onClick={() => setTagSortOrder(prev => (prev + 1) % 3)}
                                            className={`flex items-center justify-center p-1.5 bg-white border rounded-md transition-colors shadow-sm shrink-0 h-8 ${tagSortOrder !== 0 ? 'border-indigo-400 text-indigo-600' : 'border-gray-200 text-indigo-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50'}`}
                                            title={tagSortOrder === 0 ? "Sort by clicks (default)" : tagSortOrder === 1 ? "Sorting by clicks (highest first)" : "Sorting by clicks (lowest first)"}
                                        >
                                            <ArrowDownUp size={14} className={tagSortOrder === 2 ? 'rotate-180 transition-transform' : 'transition-transform'} />
                                            {tagSortOrder !== 0 && <span className="text-[10px] font-bold ml-1">{tagSortOrder === 1 ? 'High' : 'Low'}</span>}
                                        </button>

                                        {!hasScannedSite ? (
                                            <button type="button" onClick={handleScanSite} className="flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[11px] font-bold hover:bg-indigo-100 hover:border-indigo-200 transition-colors shadow-sm whitespace-nowrap shrink-0 h-8" title="Scan site for Amazon links">
                                                <Activity size={14} /> Scan Site For Amazon Links
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[11px] font-bold shadow-sm whitespace-nowrap shrink-0 h-8">
                                                <LinkIcon size={13} className="text-indigo-500" />
                                                <span>{amazonLinksFound} Amazon Links Found</span>
                                                <span className="text-indigo-200 mx-0.5">|</span>
                                                <button type="button" onClick={handleScanSite} className="hover:text-indigo-900 transition-colors focus:outline-none underline">Re-Scan Site</button>
                                            </div>
                                        )}

                                        <button type="button" onClick={() => { setExclusionModalType('tags'); setExclusionTab('all'); }} className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[11px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm whitespace-nowrap shrink-0 h-8">
                                            <Ban size={13} className="text-indigo-500" /> <span className="hidden sm:inline">Excluded URLs</span><span className="sm:hidden">Exclusions</span>
                                            {(formData.globalExclusions.length > 0 || formData.globalExcludedTrees.length > 0) && <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] ml-0.5 leading-none flex items-center justify-center min-w-[16px] h-[16px]">{formData.globalExclusions.length + formData.globalExcludedTrees.length}</span>}
                                        </button>

                                        <button type="button" onClick={() => setTagsExpanded(!tagsExpanded)} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[11px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm whitespace-nowrap h-8">
                                            {tagsExpanded ? <ChevronUp size={13} className="text-gray-500" /> : <Layers size={13} className="text-indigo-500" />}
                                            {tagsExpanded ? "Collapse" : "Expand Tags"}
                                            {!tagsExpanded && <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] ml-0.5 leading-none flex items-center justify-center min-w-[18px] h-[18px]">{formData.btn1AffiliateRules.length}</span>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {tagsExpanded && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                {displayedTags.map((rule) => {
                                  const ruleIdx = rule._origIdx;
                                    
                                  if (tagSearchQuery) {
                                      const q = tagSearchQuery.toLowerCase();
                                      const matches = (rule.nickname || '').toLowerCase().includes(q) || (rule.affiliateId || '').toLowerCase().includes(q);
                                      if (!matches) return null;
                                  }

                                  const domainSitewideRule = formData.btn1AffiliateRules.find(r => r.domain === rule.domain && r.mode === 'sitewide');
                                  const sitewideInfo = domainSitewideRule ? { ruleId: domainSitewideRule.id, ruleIndex: formData.btn1AffiliateRules.findIndex(r => r.id === domainSitewideRule.id) + 1, nickname: domainSitewideRule.nickname, domain: domainSitewideRule.domain, affiliateId: domainSitewideRule.affiliateId } : null;
                                  
                                  const usedElsewhere = {};
                                  formData.btn1AffiliateRules.forEach((otherRule, otherIdx) => {
                                    if (otherRule.id !== rule.id && otherRule.ruleValues) {
                                      otherRule.ruleValues.forEach(val => {
                                        usedElsewhere[val] = { ruleId: otherRule.id, ruleIndex: otherIdx + 1, nickname: otherRule.nickname, affiliateId: otherRule.affiliateId || 'Unknown', domain: otherRule.domain, isCategory: false, mode: otherRule.mode };
                                        targetOptions.filter(t => t.parentCategory === val).forEach(childProd => {
                                          if (!usedElsewhere[childProd.value]) usedElsewhere[childProd.value] = { ruleId: otherRule.id, ruleIndex: otherIdx + 1, nickname: otherRule.nickname, affiliateId: otherRule.affiliateId, domain: otherRule.domain, isCategory: true, mode: otherRule.mode };
                                        });
                                      });
                                    }
                                  });
                                  const currentInherited = [];
                                  if (rule.ruleValues) {
                                    rule.ruleValues.forEach(val => { targetOptions.filter(t => t.parentCategory === val).forEach(childProd => { currentInherited.push(childProd.value); }); });
                                  }
                                  
                                  return (
                                  <div 
                                      key={rule.id} 
                                      id={`tag-rule-${rule.id}`} 
                                      draggable={!tagSearchQuery && tagSortOrder === 0 && (dragEnabledId === rule.id || draggedRuleIdx === ruleIdx)}
                                      onDragStart={(e) => handleDragStart(e, ruleIdx)}
                                      onDragEnter={(e) => handleDragEnter(e, ruleIdx)}
                                      onDragOver={(e) => e.preventDefault()}
                                      onDragEnd={handleDragEnd}
                                      onDrop={(e) => handleDrop(e, ruleIdx)}
                                      style={{ zIndex: (dragOverRuleIdx === ruleIdx || collapsedAssignedLists[rule.id]) ? 60 : 50 - ruleIdx }} 
                                      className={`relative bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col mt-4 transition-all group hover:z-[60] ${rule.enabled === false ? 'opacity-60 grayscale-[0.3]' : 'bg-white'} ${dragOverRuleIdx === ruleIdx ? 'border-indigo-500 shadow-md scale-[1.01] ring-2 ring-indigo-500/20' : 'hover:shadow-md'} ${draggedRuleIdx === ruleIdx ? 'border-dashed border-gray-400' : ''}`}
                                  >
                                      
                                      {/* FLOATING TOP-LEFT: Status, Nickname, Clicks */}
                                      <div className="absolute -top-3 -left-3 z-20 flex items-center max-w-[calc(100%-80px)] w-max pointer-events-none">
                                          <div className={`text-white text-[11px] font-bold pl-1.5 pr-2.5 py-1 rounded shadow-sm transition-colors flex items-center gap-1.5 w-full pointer-events-auto ${rule.enabled === false ? 'bg-gray-400' : 'bg-indigo-600'}`}>
                                              
                                              {/* Embedded Toggle Switch */}
                                              <button 
                                                  type="button" 
                                                  onClick={() => handleRuleChange(1, rule.id, 'enabled', !rule.enabled)}
                                                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rule.enabled !== false ? 'bg-indigo-400 hover:bg-indigo-300' : 'bg-gray-500 hover:bg-gray-600'}`}
                                                  title={rule.enabled !== false ? "Turn off tag" : "Turn on tag"}
                                              >
                                                  <span aria-hidden="true" className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${rule.enabled !== false ? 'translate-x-3' : 'translate-x-0'}`} />
                                              </button>
                                              
                                              <div className="w-px h-3.5 bg-white/40 shrink-0 mr-0.5"></div>

                                              {/* Title & Click Stats */}
                                              <span className="cursor-default flex items-center shrink-0">
                                                  Tag #{ruleIdx + 1}
                                                  <span className="text-white/30 mx-1.5 font-normal">|</span>
                                                  <BarChart2 size={11} className="mr-1 mb-[1px]" strokeWidth={2.5} />
                                                  {rule.clicks || 0} Clicks
                                              </span>
                                              
                                              {/* Reset Icon */}
                                              {(rule.clicks > 0) && (
                                                  <button 
                                                      type="button" 
                                                      onClick={(e) => { e.stopPropagation(); handleResetRowClicks(rule.affiliateId, () => handleRuleChange(1, rule.id, 'clicks', 0)); }} 
                                                      className="text-white/70 hover:text-white ml-0.5 shrink-0 flex items-center transition-colors focus:outline-none" 
                                                      title="Reset clicks"
                                                  >
                                                      <RotateCcw size={10} strokeWidth={2.5} />
                                                  </button>
                                              )}

                                              {/* Nickname & Edit Icon */}
                                              <div className="flex items-center min-w-0 flex-1">
                                                  {editingNicknames[`tag-${rule.id}`] ? (
                                                      <input
                                                          type="text" autoFocus value={rule.nickname || ''}
                                                          onChange={(e) => handleRuleChange(1, rule.id, 'nickname', e.target.value)}
                                                          onBlur={() => setEditingNicknames(prev => ({...prev, [`tag-${rule.id}`]: false}))}
                                                          onKeyDown={(e) => e.key === 'Enter' && setEditingNicknames(prev => ({...prev, [`tag-${rule.id}`]: false}))}
                                                          className="text-gray-900 bg-white px-1.5 py-0.5 text-[10px] rounded outline-none font-semibold placeholder:text-gray-400 shadow-inner ml-1 w-full min-w-[100px]" placeholder="Tag Name"
                                                      />
                                                  ) : (
                                                      <>
                                                          {rule.nickname && <span className="font-semibold text-white border-l border-white/40 pl-1.5 ml-0.5 truncate block">{rule.nickname}</span>}
                                                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setEditingNicknames(prev => ({...prev, [`tag-${rule.id}`]: true}))} className="bg-white/20 hover:bg-white/30 text-white p-0.5 rounded transition-all focus:outline-none shadow-sm flex items-center justify-center ml-0.5 shrink-0" title="Edit Tag Name"><Pencil size={11} strokeWidth={2.5} /></button>
                                                      </>
                                                  )}
                                              </div>
                                          </div>
                                      </div>

                                      {/* FLOATING TOP-RIGHT: Actions */}
                                      <div className="absolute -top-2.5 -right-2.5 flex items-center gap-1.5 z-30">
                                          {formData.btn1AffiliateRules.length > 1 && (
                                              <button type="button" onClick={(e) => handleRemoveRule(1, rule.id, e)} className="bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-full p-1.5 shadow-sm transition-all pointer-events-auto" title="Delete tag">
                                                  <Trash2 size={13} strokeWidth={2.5} />
                                              </button>
                                          )}
                                          {!tagSearchQuery && tagSortOrder === 0 && formData.btn1AffiliateRules.length > 1 && (
                                              <div 
                                                  onMouseEnter={() => setDragEnabledId(rule.id)}
                                                  onMouseLeave={() => { if (draggedRuleIdx === null) setDragEnabledId(null); }}
                                                  className="bg-white text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full p-1.5 shadow-sm transition-all cursor-grab active:cursor-grabbing flex items-center justify-center pointer-events-auto"
                                                  title="Drag to reorder"
                                              >
                                                  <GripVertical size={13} strokeWidth={2.5} />
                                              </div>
                                          )}
                                      </div>

                                      {/* CARD CONTENT */}
                                      <div className={`p-4 pt-6 w-full flex flex-col gap-4 transition-all duration-300 ${rule.enabled === false ? 'opacity-40 pointer-events-none select-none grayscale-[0.3]' : ''}`}>
                                          <div className="flex flex-wrap sm:flex-nowrap items-start gap-4 w-full">
                                              <div className="w-[110px] shrink-0">
                                                  <label className="text-[11px] font-bold text-gray-600 mb-1 block">Apply to</label>
                                                  <StyledSelect value={rule.mode} onChange={(e) => handleRuleChange(1, rule.id, 'mode', e.target.value)} wrapperClassName="w-full shadow-sm" className="!py-1.5 !px-3 text-[13px] font-semibold h-[34px] text-gray-700">
                                                      <option value="sitewide">Sitewide</option>
                                                      <option value="rules">Set Rules</option>
                                                  </StyledSelect>
                                              </div>
                                              <div className="hidden sm:block w-px h-[34px] bg-gray-200 shrink-0 mx-1 mt-[18px]"></div>
                                              <div className="flex-1 min-w-[150px]">
                                                  <label className="text-[11px] font-bold text-gray-600 mb-1 block">Affiliate ID</label>
                                                  <StyledInput type="text" placeholder="tag-20" value={rule.affiliateId} onChange={(e) => handleRuleChange(1, rule.id, 'affiliateId', e.target.value)} className="!py-1.5 !px-3 text-[13px] font-semibold text-gray-700 h-[34px] w-full shadow-inner" />
                                              </div>
                                              <div className="w-[170px] shrink-0">
                                                  <label className="text-[11px] font-bold text-gray-600 mb-1 block">Amazon domain</label>
                                                  <StyledSelect value={rule.domain} onChange={(e) => handleRuleChange(1, rule.id, 'domain', e.target.value)} wrapperClassName="w-full shadow-sm" className="!py-1.5 !px-3 text-[13px] font-semibold h-[34px] text-gray-700">
                                                      {amazonDomains.map((domain) => (<option key={domain.value} value={domain.value}>{domain.label}</option>))}
                                                  </StyledSelect>
                                              </div>
                                          </div>

                                          {rule.mode === 'rules' && (
                                              <div className="animate-in fade-in slide-in-from-top-1 bg-gray-50/80 p-3 pt-1 rounded-lg relative z-[100] border border-gray-100 mt-2">
                                                  <SearchableDropdown 
                                                      options={targetOptions} selectedValues={rule.ruleValues || []} currentInherited={currentInherited} usedElsewhere={usedElsewhere} currentRuleIndex={ruleIdx + 1} currentRuleId={rule.id} currentRuleMode={rule.mode} currentRuleNickname={rule.nickname} currentRuleDomain={rule.domain} currentRuleAffiliateId={rule.affiliateId} allRules={globalAllRulesList} sitewideInfo={sitewideInfo}
                                                      globalExclusions={formData.globalExclusions} globalExcludedTrees={formData.globalExcludedTrees} globalExceptions={formData.globalExceptions}
                                                      onSelect={(val) => handleRuleTargetAdd(1, rule.id, val)} 
                                                      onBulkSelect={(values) => handleRuleTargetBulkAdd(1, rule.id, values)}
                                                      onBulkRemove={(values) => handleRuleTargetBulkRemove(1, rule.id, values)}
                                                      onTransfer={(val, fromRuleId, toRuleId) => handleTransferRuleTarget(1, val, fromRuleId, toRuleId)} 
                                                      onRemove={(val) => handleRuleTargetRemove(1, rule.id, val)} 
                                                      onRemoveFromOther={(val, fromRuleId) => handleRuleTargetRemove(1, fromRuleId, val)} 
                                                      onRestoreExcluded={handleRestoreExcluded}
                                                      placeholder="Search master list of pages, categories, and products..." 
                                                  />
                                                  
                                                  {rule.ruleValues && rule.ruleValues.length > 0 && (() => {
                                                      const isExpanded = collapsedAssignedLists[rule.id] === true;
                                                      const toggleCollapse = () => setCollapsedAssignedLists(prev => ({...prev, [rule.id]: !isExpanded}));
                                                      
                                                      const assignedItems = rule.ruleValues.map(val => {
                                                          const optData = getOptionData(val);
                                                          return { val, type: optData?.type || 'Unknown', label: optData?.label || val, link: getLinkForValue(val), childCount: optData?.childCount, childLabel: optData?.childLabel, linkCount: optData?.linkCount };
                                                      });

                                                      const groupedAssigned = assignedItems.reduce((acc, item) => {
                                                      if (!acc[item.type]) acc[item.type] = [];
                                                      acc[item.type].push(item);
                                                      return acc;
                                                  }, {});

                                                  const sortedAssignedTypes = Object.keys(groupedAssigned).sort((a, b) => {
                                                      const indexA = TYPE_ORDER.indexOf(a);
                                                      const indexB = TYPE_ORDER.indexOf(b);
                                                      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
                                                  });

                                                  return (
                                                          <div className="mt-3 border border-gray-200 rounded-lg bg-white shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                                              <div className="bg-gray-50/80 px-3 py-2 border-b border-gray-200 flex justify-between items-center select-none rounded-t-lg group cursor-pointer" onClick={toggleCollapse}>
                                                                  <div className="flex items-center gap-3">
                                                                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-700 transition-colors" title={isExpanded ? "Collapse assigned items" : "Expand assigned items"}>
                                                                          TAG #{ruleIdx + 1} {rule.nickname ? `(${rule.nickname}) ` : ''}USED {rule.ruleValues.length} {rule.ruleValues.length === 1 ? 'TIME' : 'TIMES'}
                                                                      </span>
                                                                      <button type="button" onClick={(e) => { e.stopPropagation(); handleRuleTargetClearAll(1, rule.id); }} className="text-[9px] font-bold bg-white text-gray-400 border border-gray-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 px-2 py-0.5 rounded shadow-sm transition-colors" title="Clear all assigned items">Clear All</button>
                                                                  </div>
                                                                  <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-indigo-600 transition-colors">
                                                                      <span className="text-[9px] font-bold">{isExpanded ? 'HIDE' : 'SHOW'}</span>
                                                                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                                  </div>
                                                              </div>
                                                              
                                                              {isExpanded && (
                                                                  <div className="relative flex flex-col rounded-b-lg">
                                                                      <div className="h-[170px] min-h-[120px] max-h-[60vh] resize-y overflow-y-auto custom-scrollbar bg-white flex flex-col rounded-b-lg">
                                                                          {sortedAssignedTypes.map(type => (
                                                                              <div key={type} className="relative">
                                                                                  <div className="px-3 py-1.5 bg-gray-100/95 backdrop-blur-sm text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 border-t first:border-t-0 sticky top-0 z-10 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                                                                      {getTypeLabel(type)}
                                                                                  </div>
                                                                                  <div className="divide-y divide-gray-100/70">
                                                                                      {groupedAssigned[type].map((item, idx) => (
                                                                                          <div key={idx} className="flex items-center justify-between p-3 hover:bg-indigo-50/30 transition-colors group">
                                                                                              <div className="flex-1 min-w-0 pr-3">
                                                                                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                                                      <span className="text-[13px] font-semibold text-gray-800 truncate">{item.label}</span>
                                                                                                      
                                                                                                      {/* Child Count Badge (For Categories) */}
                                                                                                      {item.childCount > 0 && (
                                                                                                          <span className="flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded shadow-sm border border-sky-100" title={`${item.childCount} ${item.childLabel} inside this category`}>
                                                                                                              <FileText size={10} /> {item.childCount} {item.childLabel}
                                                                                                          </span>
                                                                                                      )}

                                                                                                      {/* Target Link Count Badge */}
                                                                                                      {item.linkCount > 0 && (
                                                                                                          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shadow-sm border border-indigo-100" title={`${item.linkCount} Amazon links found in this ${item.type.toLowerCase()}`}>
                                                                                                              <LinkIcon size={10} /> {item.linkCount} Amazon Links
                                                                                                          </span>
                                                                                                      )}
                                                                                                  </div>
                                                                                                  {item.link && (
                                                                                                      <div className="flex items-center gap-1.5">
                                                                                                          <span className="text-[11px] text-gray-500 font-mono truncate">{item.link}</span>
                                                                                                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0" title="Open link"><ExternalLink size={15} /></a>
                                                                                                      </div>
                                                                                                  )}
                                                                                              </div>
                                                                                              <button type="button" onClick={() => handleRuleTargetRemove(1, rule.id, item.val)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 border border-transparent hover:border-red-100 transition-all focus:outline-none shrink-0" title="Remove assignment"><X size={16} strokeWidth={2.5} /></button>
                                                                                          </div>
                                                                                      ))}
                                                                                  </div>
                                                                              </div>
                                                                          ))}
                                                                      </div>
                                                                      <div className="absolute bottom-0.5 right-0.5 pointer-events-none text-indigo-400 z-50 opacity-80">
                                                                         <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                                             <line x1="15" y1="6" x2="6" y2="15" /><line x1="15" y1="11" x2="11" y2="15" />
                                                                         </svg>
                                                                      </div>
                                                                  </div>
                                                              )}
                                                          </div>
                                                      );
                                                  })()}
                                              </div>
                                          )}
                                      </div>
                                  </div>
                                )})}
                                <div className="flex justify-start mt-2 px-1">
                                    <button ref={addRuleButtonRef} type="button" onClick={() => handleAddRule(1)} className="flex items-center gap-1.5 text-[13px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors focus:outline-none">
                                        <Plus size={16} strokeWidth={2.5} /> Add Tag
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>

                        <div>
                            {svcUsage && !svcUsage.usage && (
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <a href={svcUsage.connect_url} target="_top" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, borderRadius: '8px', padding: '10px 20px', textDecoration: 'none', cursor: 'pointer', lineHeight: 1, whiteSpace: 'nowrap', transition: '.12s', color: '#fff', background: '#2563eb', border: '1px solid #2563eb', boxShadow: '0 4px 10px -3px rgba(37,99,235,.5)' }} onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.borderColor = '#1d4ed8'; }} onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.borderColor = '#2563eb'; }}>Connect your DevDome account</a>
                                    <span className="text-[13px] text-gray-500">Store routing runs on DevDome servers. Requires a DevDome account.</span>
                                </div>
                            )}
                            <div className={svcUsage && !svcUsage.usage ? 'opacity-50 pointer-events-none' : ''}>
                            <SettingRow label="OneLink Alternative" hint="Visitors land on their local Amazon store with your tag for it." tooltip="Visitors from a country where you have a regional tag are sent to that store (with the matching product when it exists, otherwise its search page). Everyone else keeps the original link, so a commission is never lost.">
                                <SimpleCheckbox name="geoEnabled" checked={formData.geoEnabled} onChange={handleCheckboxChange} label="Auto-redirect visitors to their local Amazon store" />
                            </SettingRow>
                            </div>
                        </div>

                        <div>
                            <div className="border-b border-gray-100 pb-3 mb-6">
                                <h3 className="text-base font-bold text-gray-800">Link Options</h3>
                            </div>
                            <SettingRow label="SEO Attributes" hint="nofollow and sponsored are what Amazon expects on affiliate links." tooltip="Amazon Associates asks for rel=nofollow sponsored on affiliate links. Open in new tab keeps your page open while the visitor shops.">
                               <div className="flex flex-wrap items-center gap-6 pt-1">
                                  <label className="flex items-center text-sm font-semibold text-gray-700 cursor-pointer select-none group">
                                    <input type="radio" name="btn1FollowMode" value="nofollow" checked={formData.btn1FollowMode === 'nofollow'} onChange={handleChange} className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" /> <span className="group-hover:text-indigo-600 transition-colors">No Follow</span>
                                  </label>
                                  <label className="flex items-center text-sm font-semibold text-gray-700 cursor-pointer select-none group">
                                    <input type="radio" name="btn1FollowMode" value="follow" checked={formData.btn1FollowMode === 'follow'} onChange={handleChange} className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" /> <span className="group-hover:text-indigo-600 transition-colors">Follow</span>
                                  </label>
                                  <div className="w-px h-5 bg-gray-300 hidden sm:block"></div>
                                  <label className="flex items-center text-sm font-semibold text-gray-700 cursor-pointer select-none group">
                                    <input type="checkbox" name="btn1OpenInNewTab" checked={formData.btn1OpenInNewTab} onChange={handleChange} className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /> <span className="group-hover:text-indigo-600 transition-colors">Open in New Tab</span>
                                  </label>
                                  <div className="w-px h-5 bg-gray-300 hidden sm:block"></div>
                                  <div className="flex items-center gap-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 cursor-pointer select-none group">
                                      <input type="checkbox" name="btn1Sponsored" checked={formData.btn1Sponsored} onChange={handleChange} className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /> <span className="group-hover:text-indigo-600 transition-colors">Sponsored</span>
                                    </label>
                                    <InfoTooltip text="Adding the 'sponsored' attribute helps search engines identify affiliate links correctly and avoids SEO penalties for undisclosed commercial relationships." />
                                  </div>
                               </div>
                            </SettingRow>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-6">
                                <h3 className="text-base font-bold text-gray-800">Button Display</h3>
                                <InfoTooltip text="Controls the [devdaffi_button] shortcode: a styled button you can place in any post, page, or product. It links to a product (from its ASIN) or a custom URL and is automatically affiliate-tagged." />
                            </div>
                            <SettingRow label="Button Text" hint="Shown on every generated Amazon button." tooltip="Change it site wide here. A single button can override it in its shortcode.">
                               <div className="flex flex-col gap-2">
                                 <StyledInput type="text" name="btn1Text" value={formData.btn1Text} onChange={handleChange} placeholder="Check Price On Amazon" />
                               </div>
                            </SettingRow>
                            <SettingRow label="Button Link" hint="Generated links carry your tag automatically." tooltip="The button will automatically link to the Amazon product page using your affiliate settings.">
                                <div className="flex flex-col gap-4">
                                   {formData.btn1LinkMode === 'generated' ? (
                                       <div className="relative">
                                           {btn1Editing ? (
                                               <div className="flex items-center gap-2">
                                                   <select value={formData.btn1GeneratedDomain} onChange={(e) => setFormData(prev => ({ ...prev, btn1GeneratedDomain: e.target.value }))} className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm text-gray-700">
                                                       {amazonDomains.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                                   </select>
                                                   <button type="button" onClick={() => setBtn1Editing(false)} className="shrink-0 px-3 py-2 bg-indigo-600 text-white rounded-lg text-[12px] font-bold hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"><Check size={14} /> Done</button>
                                               </div>
                                           ) : (
                                               <>
                                                   <StyledInput type="text" value={`https://www.${formData.btn1GeneratedDomain}/dp/{ASIN}${formData.btn1SkipTag ? '' : '?tag={your-tag}'}`} disabled className="!pr-[155px]" />
                                                   <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
                                                       <button type="button" onClick={() => setBtn1Editing(true)} title="Change Amazon marketplace (.com, .co.uk, …)" className="px-2 py-1 bg-white border border-gray-300 rounded-md text-[11px] font-bold text-gray-700 hover:bg-gray-50 hover:border-indigo-300 shadow-sm flex items-center gap-1"><Pencil size={12} /> Edit</button>
                                                       <button type="button" onClick={() => { setFormData(prev => ({ ...prev, btn1GeneratedDomain: 'amazon.com' })); setBtn1Editing(false); }} title="Reset to amazon.com" className="px-2 py-1 bg-white border border-gray-300 rounded-md text-[11px] font-bold text-gray-700 hover:bg-gray-50 hover:border-indigo-300 shadow-sm flex items-center gap-1"><RotateCcw size={12} /> Regenerate</button>
                                                   </div>
                                               </>
                                           )}
                                       </div>
                                   ) : (
                                       <div className="flex flex-col gap-3">
                                           <StyledInput type="text" name="btn1Link" value={formData.btn1Link} onChange={handleChange} placeholder="https://your-site.com/dp/{ASIN}" />
                                       </div>
                                   )}
                                   <div className="flex gap-6 items-center flex-wrap"><label className="flex items-center gap-2 cursor-pointer group select-none"><input type="radio" name="btn1LinkMode" value="generated" checked={formData.btn1LinkMode === 'generated'} onChange={handleChange} className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" /><span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">Use Generated Link</span></label>{formData.btn1LinkMode === 'generated' && (<label className="flex items-center gap-2 cursor-pointer group select-none"><input type="checkbox" name="btn1SkipTag" checked={formData.btn1SkipTag} onChange={handleChange} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" /><span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">Don't add tag</span><InfoTooltip text="Build the Amazon link from the ASIN but leave off your ?tag= affiliate ID." /></label>)}<label className="flex items-center gap-2 cursor-pointer group select-none"><input type="radio" name="btn1LinkMode" value="custom" checked={formData.btn1LinkMode === 'custom'} onChange={handleChange} className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" /><span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">Use Custom Link</span><InfoTooltip text="Custom links to non-Amazon sites won't receive your affiliate tag. Use {ASIN} in the URL and it'll be replaced with the product's ASIN at render." /></label></div>
                                </div>
                            </SettingRow>
                            <SettingRow label="Shortcode" hint="Paste it into any post or page." tooltip="Paste this into any post or page to render the button. In generated mode, replace YOUR_ASIN with the product's Amazon ASIN.">
                               <div className="flex items-center gap-2">
                                  <code className="flex-1 px-3 py-2 bg-gray-900 text-emerald-300 rounded-lg text-[13px] font-mono select-all break-all">{(formData.btn1LinkMode === 'custom' && !/\{ASIN\}/i.test(formData.btn1Link || '')) ? '[devdaffi_button]' : '[devdaffi_button asin="YOUR_ASIN"]'}</code>
                                  <button type="button" onClick={() => { if (navigator.clipboard) navigator.clipboard.writeText((formData.btn1LinkMode === 'custom' && !/\{ASIN\}/i.test(formData.btn1Link || '')) ? '[devdaffi_button]' : '[devdaffi_button asin="YOUR_ASIN"]'); }} className="shrink-0 px-3 py-2 bg-white border border-gray-300 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-1.5"><Copy size={14} /> Copy</button>
                               </div>
                            </SettingRow>
                        </div>

                    </div>
                 </div>
              </Section>
            </div>

            {/* Suite mode: portal the remaining sections into PI's bottom slot so the visual order is
                AM-tags+button → PI-transit → PI-auto-import → AM-rest → single Save Changes. */}
            {(() => { const bottomSections = (<>
            {/* --- Keyword Auto-Linker Section --- */}
            <div className={suiteMode ? 'mt-8' : 'py-6'}>
               <Section
                   title="Keyword Auto-Linker"
                   icon={Wand2}
               >
                  <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm transition-all duration-300">
                     <div className="animate-in fade-in duration-300">
                         <div>
                            
                            {/* Toolbar (Settings, Search, Exclusions, Expand) */}
                            <div className={`flex flex-wrap xl:flex-nowrap items-center justify-between gap-2 ${(autoLinkerExpanded || showAutoLinkerGlobalSettings) ? 'border-b border-gray-100 pb-4 mb-4' : ''}`}>
                                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                                    <h3 className="text-base font-bold text-gray-800 whitespace-nowrap flex items-center gap-1.5">
                                        Keyword Rules
                                        {autoLinkerExpanded && (
                                            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] leading-none flex items-center justify-center min-w-[18px] h-[18px]">
                                                {formData.autoLinkerRules.length}
                                            </span>
                                        )}
                                        {autoLinkerExpanded && formData.autoLinkerRules.some(r => r.isBroken) && (
                                            <span className="bg-red-50 border border-red-200 text-red-600 px-1.5 py-0.5 rounded-full text-[10px] leading-none flex items-center justify-center min-w-[18px] h-[18px] font-bold" title={`${formData.autoLinkerRules.filter(r => r.isBroken).length} broken links`}>
                                                {formData.autoLinkerRules.filter(r => r.isBroken).length}
                                            </span>
                                        )}
                                        <InfoTooltip text="Turn the auto-linking engine on or off globally. When enabled, it will scan your page content and automatically convert specified keywords into Amazon links. Rules are processed top-to-bottom. Drag to set priority." alignment="left" direction="bottom" />
                                    </h3>
                                    
                                    <div className="hidden sm:block w-px h-5 bg-gray-200 mx-0.5"></div>
                                    
                                    {/* Active/Disabled Switch */}
                                    <div 
                                        className="flex items-center gap-2 px-2.5 py-1 bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition-colors h-8" 
                                        onClick={() => { const next = !formData.autoLinkerEnabled; setFormData(prev => ({...prev, autoLinkerEnabled: next})); if (next) setAutoLinkerExpanded(true); }}
                                        title={formData.autoLinkerEnabled ? "Turn Off" : "Turn On"}
                                    >
                                        <button type="button" className={`relative inline-flex h-4 w-7 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.autoLinkerEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                            <span aria-hidden="true" className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.autoLinkerEnabled ? 'translate-x-3' : 'translate-x-0'}`} />
                                        </button>
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.autoLinkerEnabled ? 'text-indigo-700' : 'text-gray-500'}`}>{formData.autoLinkerEnabled ? 'Enabled' : 'Disabled'}</span>
                                    </div>
                                </div>
                                
                                {/* Right Side Controls */}
                                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end relative z-[70]">
                                    {showAutoLinkerSearch ? (
                                       <div className="relative animate-in fade-in zoom-in-95 duration-200 flex items-center shrink-0">
                                          <input 
                                             ref={globalAutoLinkerSearchRef}
                                             type="text" 
                                             value={autoLinkerSearchQuery} 
                                             onChange={e => setAutoLinkerSearchQuery(e.target.value)} 
                                             placeholder="Search rules..." 
                                             className="pl-7 pr-7 py-1 text-xs font-semibold text-gray-700 border border-gray-200 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-[130px] h-8"
                                          />
                                          <Search size={13} className="absolute left-2.5 top-2.5 text-indigo-400 pointer-events-none" />
                                          <button type="button" onClick={() => {setShowAutoLinkerSearch(false); setAutoLinkerSearchQuery('');}} className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"><X size={13}/></button>
                                       </div>
                                    ) : (
                                       <button 
                                           type="button" 
                                           onClick={() => { setShowAutoLinkerSearch(true); setAutoLinkerExpanded(true); }}
                                           className="flex items-center justify-center p-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm shrink-0 h-8"
                                           title="Search Rules"
                                       >
                                           <Search size={14} className="text-indigo-500" />
                                       </button>
                                    )}

                                    <button 
                                        type="button" 
                                        onClick={() => setAutoLinkerSortOrder(prev => (prev + 1) % 3)}
                                        className={`flex items-center justify-center p-1.5 bg-white border rounded-md transition-colors shadow-sm shrink-0 h-8 ${autoLinkerSortOrder !== 0 ? 'border-indigo-400 text-indigo-600' : 'border-gray-200 text-indigo-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50'}`}
                                        title={autoLinkerSortOrder === 0 ? "Sort by clicks (default)" : autoLinkerSortOrder === 1 ? "Sorting by clicks (highest first)" : "Sorting by clicks (lowest first)"}
                                    >
                                        <ArrowDownUp size={14} className={autoLinkerSortOrder === 2 ? 'rotate-180 transition-transform' : 'transition-transform'} />
                                        {autoLinkerSortOrder !== 0 && <span className="text-[10px] font-bold ml-1">{autoLinkerSortOrder === 1 ? 'High' : 'Low'}</span>}
                                    </button>

                                    <button type="button" onClick={() => { setExclusionModalType('autolinker'); setExclusionTab('all'); }} className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[11px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm whitespace-nowrap shrink-0 h-8">
                                        <Ban size={13} className="text-indigo-500" /> <span className="hidden sm:inline">Excluded URLs</span><span className="sm:hidden">Exclusions</span>
                                        {(formData.globalExclusions.length > 0 || formData.globalExcludedTrees.length > 0) && <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] ml-0.5 leading-none flex items-center justify-center min-w-[16px] h-[16px]">{formData.globalExclusions.length + formData.globalExcludedTrees.length}</span>}
                                    </button>

                                    <button type="button" onClick={() => setShowAutoLinkerGlobalSettings(!showAutoLinkerGlobalSettings)} className={`flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white border rounded-md text-[11px] font-bold transition-colors shadow-sm whitespace-nowrap shrink-0 h-8 ${showAutoLinkerGlobalSettings ? 'border-indigo-400 text-indigo-700 ring-1 ring-indigo-500/20' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                        <Settings size={13} className="text-indigo-500" />
                                        Global Settings
                                        <ChevronDown size={13} className={`text-gray-400 transition-transform ${showAutoLinkerGlobalSettings ? 'rotate-180 text-indigo-500' : ''}`} />
                                    </button>

                                    <button type="button" onClick={() => setAutoLinkerExpanded(!autoLinkerExpanded)} className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[11px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm whitespace-nowrap shrink-0 h-8">
                                        {autoLinkerExpanded ? <ChevronUp size={13} className="text-gray-500" /> : <Layers size={13} className="text-indigo-500" />}
                                        {autoLinkerExpanded ? "Collapse" : "Expand Keywords"}
                                        {!autoLinkerExpanded && <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] ml-0.5 leading-none flex items-center justify-center min-w-[16px] h-[16px]">{formData.autoLinkerRules.length}</span>}
                                    </button>
                                </div>
                            </div>

                            {/* Global Settings Panel */}
                            {showAutoLinkerGlobalSettings && (
                                <div className={`flex flex-wrap items-center justify-end gap-3 bg-gray-50/80 px-4 py-2.5 rounded-lg border border-gray-200 mb-6 transition-all duration-200 animate-in fade-in slide-in-from-top-2 relative z-[120] ${!formData.autoLinkerEnabled ? 'grayscale' : ''}`}>
                                    
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[11px] font-bold text-gray-600">Max links/page</span>
                                            <InfoTooltip text="Global limit. We strongly advise keeping this limit at 1 or 2. Adding too many automated affiliate links to a single page can harm your website's SEO rankings and create a spammy user experience." />
                                        </div>
                                        <NumberInput value={formData.autoLinkerLimit} onChange={(val) => handleRadioChange('autoLinkerLimit', val)} min={1} max={99} className="w-12 h-7 py-1 px-1 text-[12px] font-bold" />
                                    </div>
                                    
                                    <div className="flex items-center gap-1 shrink-0 ml-1">
                                        <span className="text-[11px] font-bold text-gray-600 mr-0.5">Show In:</span>
                                        <CheckboxDropdown label={`${applyToCount} Selected`} icon={Layout} compact={true} scrollable={false}>
                                            {[
                                                {name: 'autoLinkerApplyPosts', label: 'Posts'},
                                                {name: 'autoLinkerApplyPages', label: 'Pages'},
                                                {name: 'autoLinkerApplyProducts', label: 'Products', hint: 'WooCommerce'}
                                            ].map(opt => (
                                                <label key={opt.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer group gap-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <input type="checkbox" name={opt.name} checked={formData[opt.name]} onChange={handleChange} className="h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 shrink-0" />
                                                        <span className="text-[12px] font-bold text-gray-700 group-hover:text-indigo-700 whitespace-nowrap">{opt.label}</span>
                                                    </div>
                                                    {opt.hint && <InfoTooltip text={opt.hint} alignment="right" />}
                                                </label>
                                            ))}
                                        </CheckboxDropdown>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0 ml-1">
                                        <span className="text-[11px] font-bold text-gray-600 mr-0.5">Skip:</span>
                                        <CheckboxDropdown label={`${skipRulesCount} Selected`} icon={Shield} compact={true} scrollable={false}>
                                            {[
                                                {name: "autoLinkerSkipHeadings", label: "Skip headings H1–H6", hint: "Won't turn keywords inside titles and headings into links"},
                                                {name: "autoLinkerSkipLinks", label: "Skip existing links", hint: "Won't put a link inside another link, prevents broken HTML"},
                                                {name: "autoLinkerSkipCode", label: "Skip code and pre blocks", hint: "Won't turn keywords inside code snippets into links"},
                                                {name: "autoLinkerSkipFirstParagraph", label: "Skip first paragraph", hint: "The first paragraph of your post won't get any auto-links. Some people prefer a clean intro before affiliate links start appearing."},
                                                {name: "autoLinkerSkipBlockquotes", label: "Skip blockquotes", hint: "Won't add links inside quoted text, keeps quotes clean and unaltered."}
                                            ].map(skip => (
                                                <label key={skip.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer group gap-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <input type="checkbox" name={skip.name} checked={formData[skip.name]} onChange={handleChange} className="h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 shrink-0" />
                                                        <span className="text-[12px] font-bold text-gray-700 group-hover:text-indigo-700 whitespace-nowrap">{skip.label}</span>
                                                    </div>
                                                    <InfoTooltip text={skip.hint} alignment="right" />
                                                </label>
                                            ))}
                                        </CheckboxDropdown>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                        <input ref={autoLinkerImportRef} type="file" accept="application/json,.json" onChange={handleImportRules} className="hidden" />
                                        <button type="button" onClick={() => autoLinkerImportRef.current && autoLinkerImportRef.current.click()} className="px-2.5 py-1 bg-white border border-gray-200 text-indigo-600 text-[11px] font-bold rounded-md shadow-sm hover:bg-indigo-50 transition-colors h-7">Import Rules</button>
                                        <button type="button" onClick={handleExportRules} className="px-2.5 py-1 bg-white border border-gray-200 text-indigo-600 text-[11px] font-bold rounded-md shadow-sm hover:bg-indigo-50 transition-colors h-7">Export Rules</button>
                                    </div>
                                </div>
                            )}

                            {autoLinkerExpanded && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">

                                {/* Keyword Rows */}
                                {displayedAutoLinkerRules.map((rule) => {
                                    const ruleIdx = rule._origIdx;
                                    
                                    if (autoLinkerSearchQuery) {
                                        const q = autoLinkerSearchQuery.toLowerCase();
                                        const matches = (rule.keywords || '').toLowerCase().includes(q) || (rule.link || '').toLowerCase().includes(q);
                                        if (!matches) return null;
                                    }

                                    const allRulesList = formData.btn1AffiliateRules.map((r, i) => ({ id: r.id, index: i + 1, nickname: r.nickname, domain: r.domain, affiliateId: r.affiliateId }));
                                    const isShortlink = /amzn\.to|a\.co|amzn\.eu/i.test(rule.link || '');
                                    const isInvalidFormat = (rule.link || '').length > 0 && !isShortlink && !(/^[a-zA-Z0-9]{10}$/.test((rule.link||'').trim()) || /amazon\./i.test(rule.link));

                                    return (
                                        <div 
                                            key={rule.id} 
                                            id={`autolink-rule-${rule.id}`}
                                            draggable={!autoLinkerSearchQuery && autoLinkerSortOrder === 0 && (autoLinkerDragEnabledId === rule.id || autoLinkerDraggedRuleIdx === ruleIdx)}
                                            onDragStart={(e) => handleAutoLinkerDragStart(e, ruleIdx)}
                                            onDragEnter={(e) => handleAutoLinkerDragEnter(e, ruleIdx)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDragEnd={handleAutoLinkerDragEnd}
                                            onDrop={(e) => handleAutoLinkerDrop(e, ruleIdx)}
                                            style={{ zIndex: (autoLinkerDragOverRuleIdx === ruleIdx || expandedAutoLinkSettings[rule.id]) ? 100 : 50 - ruleIdx }}
                                            className={`relative bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col mt-4 transition-all group hover:z-[100]
                                            ${(rule.enabled === false || !formData.autoLinkerEnabled) ? 'opacity-70 grayscale-[0.2]' : 'bg-white'}
                                            ${autoLinkerDragOverRuleIdx === ruleIdx ? 'border-indigo-500 shadow-md scale-[1.01] ring-2 ring-indigo-500/20' : 'hover:shadow-md'}
                                            ${autoLinkerDraggedRuleIdx === ruleIdx ? 'border-dashed border-gray-400' : ''}`}
                                        >
                                            
                                            {/* FLOATING TOP-LEFT: Status, Nickname, Clicks */}
                                            <div className="absolute -top-3 -left-3 z-20 flex items-center max-w-[calc(100%-80px)] w-max pointer-events-none">
                                                <div className={`text-white text-[11px] font-bold pl-1.5 pr-2.5 py-1 rounded shadow-sm transition-colors flex items-center gap-1.5 w-full pointer-events-auto ${rule.enabled === false ? 'bg-gray-400' : 'bg-indigo-600'}`}>
                                                    
                                                    {/* Embedded Toggle Switch */}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleAutoLinkRuleChange(rule.id, 'enabled', !rule.enabled)}
                                                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rule.enabled !== false ? 'bg-indigo-400 hover:bg-indigo-300' : 'bg-gray-500 hover:bg-gray-600'}`}
                                                        title={rule.enabled !== false ? "Turn off rule" : "Turn on rule"}
                                                    >
                                                        <span aria-hidden="true" className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${rule.enabled !== false ? 'translate-x-3' : 'translate-x-0'}`} />
                                                    </button>
                                                    
                                                    <div className="w-px h-3.5 bg-white/40 shrink-0 mr-0.5"></div>

                                                    {/* Title & Click Stats */}
                                                    <span className="cursor-default flex items-center shrink-0">
                                                        Rule #{ruleIdx + 1}
                                                        <span className="text-white/30 mx-1.5 font-normal">|</span>
                                                        <BarChart2 size={11} className="mr-1 mb-[1px]" strokeWidth={2.5} />
                                                        {rule.clicks || 0} Clicks
                                                    </span>
                                                    
                                                    {/* Reset Icon */}
                                                    {(rule.clicks > 0) && (
                                                        <button 
                                                            type="button" 
                                                            onClick={(e) => { e.stopPropagation(); handleResetRowClicks('__rule__' + rule.id, () => handleAutoLinkRuleChange(rule.id, 'clicks', 0)); }} 
                                                            className="text-white/70 hover:text-white ml-0.5 shrink-0 flex items-center transition-colors focus:outline-none" 
                                                            title="Reset clicks"
                                                        >
                                                            <RotateCcw size={10} strokeWidth={2.5} />
                                                        </button>
                                                    )}

                                                    {/* Nickname & Edit Icon */}
                                                    <div className="flex items-center min-w-0 flex-1">
                                                        {editingNicknames[`al-${rule.id}`] ? (
                                                            <input
                                                                type="text" autoFocus value={rule.nickname || ''}
                                                                onChange={(e) => handleAutoLinkRuleChange(rule.id, 'nickname', e.target.value)}
                                                                onBlur={() => setEditingNicknames(prev => ({...prev, [`al-${rule.id}`]: false}))}
                                                                onKeyDown={(e) => e.key === 'Enter' && setEditingNicknames(prev => ({...prev, [`al-${rule.id}`]: false}))}
                                                                className="text-gray-900 bg-white px-1.5 py-0.5 text-[10px] rounded outline-none font-semibold placeholder:text-gray-400 shadow-inner ml-1 w-full min-w-[100px]" placeholder="Rule Name"
                                                            />
                                                        ) : (
                                                            <>
                                                                {rule.nickname && <span className="font-semibold text-white border-l border-white/40 pl-1.5 ml-0.5 truncate block">{rule.nickname}</span>}
                                                                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setEditingNicknames(prev => ({...prev, [`al-${rule.id}`]: true}))} className="bg-white/20 hover:bg-white/30 text-white p-0.5 rounded transition-all focus:outline-none shadow-sm flex items-center justify-center ml-0.5 shrink-0" title="Edit nickname"><Pencil size={11} strokeWidth={2.5} /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* FLOATING TOP-RIGHT: Actions */}
                                            <div className="absolute -top-2.5 -right-2.5 flex items-center gap-1.5 z-30">
                                                {formData.autoLinkerRules.length > 1 && (
                                                    <button type="button" onClick={(e) => handleRemoveAutoLinkRule(rule.id, e)} className="bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-full p-1.5 shadow-sm transition-all pointer-events-auto" title="Delete rule">
                                                        <Trash2 size={13} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                                
                                                <button 
                                                    type="button" 
                                                    onClick={() => setExpandedAutoLinkSettings(prev => ({...prev, [rule.id]: !prev[rule.id]}))} 
                                                    className={`bg-white rounded-full p-1.5 shadow-sm transition-all border pointer-events-auto ${expandedAutoLinkSettings[rule.id] ? 'border-indigo-300 text-indigo-600 ring-1 ring-indigo-500/20' : 'border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50'}`} 
                                                    title="Rule settings"
                                                >
                                                    <Settings size={13} strokeWidth={2.5} />
                                                </button>

                                                <button type="button" onClick={() => handleDuplicateAutoLinkRule(rule.id)} className="bg-white text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full p-1.5 shadow-sm transition-all pointer-events-auto" title="Duplicate rule">
                                                    <Copy size={13} strokeWidth={2.5} />
                                                </button>

                                                {!autoLinkerSearchQuery && autoLinkerSortOrder === 0 && formData.autoLinkerRules.length > 1 && (
                                                    <div 
                                                        onMouseEnter={() => setAutoLinkerDragEnabledId(rule.id)}
                                                        onMouseLeave={() => { if (autoLinkerDraggedRuleIdx === null) setAutoLinkerDragEnabledId(null); }}
                                                        className="bg-white text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full p-1.5 shadow-sm transition-all cursor-grab active:cursor-grabbing flex items-center justify-center pointer-events-auto"
                                                        title="Drag to reorder"
                                                    >
                                                        <GripVertical size={13} strokeWidth={2.5} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* CARD CONTENT */}
                                            {expandedAutoLinkSettings[rule.id] && (
                                                <div className="border-b border-gray-100 px-4 py-3 bg-gray-50/80 shadow-inner animate-in fade-in zoom-in-95 duration-200 flex flex-wrap items-center justify-end gap-4 relative z-[100] mt-4 mx-0.5 rounded-t-md">
                                                    
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <div className="flex items-center gap-1">
                                                           <span className="text-[11px] font-bold text-gray-600">Max links/page</span>
                                                           <InfoTooltip text="Rule limit. We strongly advise keeping this limit low. Linking the same keyword too many times can harm SEO." direction="bottom" alignment="center" className="z-[9999]" />
                                                        </div>
                                                        <NumberInput value={rule.maxLinks} onChange={(val) => handleAutoLinkRuleChange(rule.id, 'maxLinks', val)} min={1} max={99} placeholder="2" className="w-10 h-7 py-1 px-1.5 text-[12px] font-bold" />
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1.5 shrink-0 ml-2 border-l border-gray-200 pl-3">
                                                        <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">Match type</span>
                                                        <MatchTypeDropdown value={rule.matchType || 'exact'} onChange={(val) => handleAutoLinkRuleChange(rule.id, 'matchType', val)} />
                                                    </div>
                                                    
                                                    {(!rule.matchType || rule.matchType === 'exact') && (
                                                        <div className="flex items-center gap-1.5 shrink-0 animate-in fade-in zoom-in-95 duration-200 ml-2 border-l border-gray-200 pl-3">
                                                            <label className="flex items-center gap-2 cursor-pointer group select-none">
                                                                <input type="checkbox" checked={rule.caseSensitive || false} onChange={(e) => handleAutoLinkRuleChange(rule.id, 'caseSensitive', e.target.checked)} className="h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 flex-shrink-0 shadow-sm" />
                                                                <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Case sensitive</span>
                                                            </label>
                                                            <InfoTooltip text='When enabled: "Nike" and "nike" are different keywords, only "Nike" gets linked. When disabled: both get linked.' direction="bottom" alignment="center" className="z-[9999]" />
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-1.5 shrink-0 ml-2 border-l border-gray-200 pl-3">
                                                        <label className="flex items-center gap-2 cursor-pointer group select-none">
                                                            <input type="checkbox" checked={rule.firstMatchOnly || false} onChange={(e) => handleAutoLinkRuleChange(rule.id, 'firstMatchOnly', e.target.checked)} className="h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 flex-shrink-0 shadow-sm" />
                                                            <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Only link first match</span>
                                                        </label>
                                                        <InfoTooltip text="Skip all other occurrences after the first link appears" direction="bottom" alignment="right" className="z-[9999]" />
                                                    </div>

                                                </div>
                                            )}

                                            <div className={`p-4 ${expandedAutoLinkSettings[rule.id] ? 'pt-4' : 'pt-6'} w-full flex flex-col gap-3 transition-all duration-300 relative z-10`}>
                                                
                                                {/* Row 1: Keywords Box */}
                                                <div className="w-full">
                                                    <label className="text-[11px] font-bold text-gray-600 mb-1 flex items-center">
                                                        Keywords <span className="lowercase font-normal text-gray-400 ml-1 truncate">(Type and press Enter or Comma)</span>
                                                    </label>
                                                    <KeywordTokenInput 
                                                        value={rule.keywords} 
                                                        onChange={(val) => handleAutoLinkRuleChange(rule.id, 'keywords', val)} 
                                                        placeholder="e.g. sony headphones, WH-1000XM5" 
                                                    />
                                                </div>
                                                
                                                {/* Row 2: Link and Tag */}
                                                <div className="flex items-start gap-4 w-full">
                                                    <div className="flex-[3] min-w-[200px] w-full">
                                                        <label className="text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1.5">
                                                            Target link / ASIN
                                                            {rule.isBroken && !isInvalidFormat && !isShortlink && (
                                                                <span className="flex items-center gap-0.5 text-red-500 bg-red-50 px-1.5 rounded border border-red-100" title="Broken link detected! The destination URL returned a 404 error.">
                                                                    <AlertCircle size={10} strokeWidth={3} />
                                                                    <span className="text-[9px] font-bold tracking-wide">ASIN 404</span>
                                                                </span>
                                                            )}
                                                            {isShortlink && (
                                                                <span className="flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1.5 rounded border border-amber-200" title="Amazon shorteners not supported.">
                                                                    <AlertCircle size={10} strokeWidth={3} />
                                                                    <span className="text-[9px] font-bold tracking-wide">Shortlink</span>
                                                                </span>
                                                            )}
                                                            {isInvalidFormat && !isShortlink && (
                                                                <span className="flex items-center gap-0.5 text-orange-500 bg-orange-50 px-1.5 rounded border border-orange-100" title="Does not look like a valid Amazon link or ASIN.">
                                                                    <AlertCircle size={10} strokeWidth={3} />
                                                                    <span className="text-[9px] font-bold tracking-wide">Invalid Format</span>
                                                                </span>
                                                            )}
                                                        </label>
                                                        <AutoResizeTextarea 
                                                            value={rule.link} 
                                                            onChange={(e) => handleAutoLinkRuleChange(rule.id, 'link', e.target.value)} 
                                                            placeholder="https://... or ASIN" 
                                                            className={`w-full text-sm font-medium font-mono break-all rounded-lg focus:outline-none focus:ring-2 py-1.5 px-3 placeholder:text-gray-400 min-h-[34px] transition-colors shadow-sm leading-relaxed ${isShortlink ? 'bg-amber-50/30 border border-amber-300 focus:ring-amber-500/20 focus:border-amber-500 text-amber-900' : isInvalidFormat ? 'bg-orange-50/30 border border-orange-300 focus:ring-orange-500/20 focus:border-orange-500 text-orange-900' : rule.isBroken ? 'bg-red-50/30 border border-red-300 focus:ring-red-500/20 focus:border-red-500 text-red-900' : 'bg-white border border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-700'}`} 
                                                        />
                                                    </div>
                                                    
                                                    {/* Compact Custom Affiliate Tag Dropdown */}
                                                    <div className="w-[100px] shrink-0 mt-[18px]">
                                                        <AutoLinkTagDropdown
                                                            value={rule.tag}
                                                            onChange={(newTagId) => handleAutoLinkRuleChange(rule.id, 'tag', newTagId)}
                                                            allRules={globalAllRulesList}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}

                                {formData.autoLinkerRules.length === 0 && !autoLinkerSearchQuery && (
                                    <div className="text-center py-8 text-sm text-gray-500 bg-white rounded-lg border border-dashed border-gray-200">
                                        No keyword rules yet. Click below to start auto-linking.
                                    </div>
                                )}
                                
                                <div className="flex justify-start mt-2 px-1">
                                    <button type="button" onClick={handleAddAutoLinkRule} className="flex items-center gap-1.5 text-[13px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors focus:outline-none">
                                        <Plus size={16} strokeWidth={2.5} /> Add Rule
                                    </button>
                                </div>
                            </div>
                            )}
                         </div>
                     </div>
                  </div>
               </Section>
            </div>

            {/* --- Link Radar Section --- */}
            <div className={suiteMode ? 'mt-8' : 'py-6'}>
               <Section title="Link Radar" icon={Activity}>
                  <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm space-y-12">
                     <div>
                         <div className="border-b border-gray-100 pb-4 mb-6">
                             <h3 className="text-base font-bold text-gray-800">Link Scanner</h3>
                         </div>

                         <SettingRow label="Status" hint="Last scan result. Scan again after adding new Amazon links." tooltip="The scanner reads posts, pages and WooCommerce external products for Amazon links. A scan changes nothing, it only builds the list the monitor checks.">
                             <div className="space-y-4">
                                 {scanState === 'idle' && (
                                     <button type="button" onClick={handleScanSite} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-sm font-bold hover:bg-indigo-100 hover:border-indigo-200 transition-colors shadow-sm whitespace-nowrap">
                                         <Activity size={16} /> Scan Site For Amazon Links
                                     </button>
                                 )}

                                 {scanState === 'scanning' && (
                                     <span className="flex items-center gap-2 text-sm text-indigo-700 font-bold"><Loader2 size={16} className="animate-spin" /> Scanning…</span>
                                 )}

                                 {scanState === 'done' && (
                                     <div className="flex justify-between items-center px-1">
                                         <div className="flex items-center gap-2 text-sm">
                                             <span className="font-semibold text-gray-700">Current State:</span>
                                             <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 font-bold text-xs">
                                                 <Check size={14} className="stroke-[3]" /> {amazonLinksFound} Links Around {scanPages} Pages
                                             </span>
                                         </div>
                                         <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                             <button type="button" onClick={handleScanSite} className="text-indigo-600 hover:text-indigo-800 transition-colors font-bold cursor-pointer bg-transparent border-none p-0">Scan Again</button>
                                             <InfoTooltip text="Links are found automatically in the background. Use this manual rescan only if something breaks or you migrated content from another plugin." alignment="right" />
                                         </div>
                                     </div>
                                 )}
                             </div>
                         </SettingRow>

                         <SettingRow label="Auto Re-Scan" hint="Keeps the link list current without manual scans." tooltip="How often the plugin automatically re-scans your content for Amazon links. Manual scans are always available above.">
                             <SimpleCheckbox name="scanAuto" checked={formData.scanAuto} onChange={handleCheckboxChange} label="Automatically re-scan on a schedule" />
                         </SettingRow>

                         {formData.scanAuto && (
                           <SettingRow label="Scan every" hint="7 days suits most sites." tooltip="Shorter intervals only help if you publish Amazon links daily. A re-scan reads your content on your own server and uses no link checks.">
                             <div className="flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-1 duration-200">
                               <input
                                  type="number" name="scanFrequency" value={formData.scanFrequency} onChange={handleChange}
                                  onBlur={e => { const n = parseInt(e.target.value, 10); setFormData(p => ({ ...p, scanFrequency: String(n >= 1 ? Math.min(n, 365) : 7) })); }}
                                  min="1" max="365"
                                  className="w-16 h-[34px] px-2 py-1.5 bg-white border border-gray-400 rounded-lg text-center text-[13px] font-semibold text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                               />
                               <div className="relative w-28">
                                  <select
                                     name="scanFrequencyUnit" value={formData.scanFrequencyUnit} onChange={handleChange}
                                     className="appearance-none w-full h-[34px] pl-3 pr-8 bg-white border border-gray-400 rounded-lg text-[13px] font-semibold text-gray-700 shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                  >
                                     <option value="hours">Hours</option>
                                     <option value="days">Days</option>
                                  </select>
                                  <ChevronDown size={16} className="text-gray-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                               </div>
                             </div>
                           </SettingRow>
                         )}
                     </div>

                     <div>
                         <div className="border-b border-gray-100 pb-4 mb-6">
                             <h3 className="text-base font-bold text-gray-800">Stock & 404 Monitor</h3>
                         </div>

                         {/* Unified status list: 3 always-visible expandable rows (Live / Out of Stock / 404). Live lazy-loads. */}
                         <div className="space-y-3 mb-6">
                            {monitorHasMore && <div className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">More flagged products exist than the 100 listed here. Replace or fix these first, then check again.</div>}
                            {replaceUnfinished.length > 0 && <div className="text-[12px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">An earlier replacement was interrupted before these posts were verified: {replaceUnfinished.join(', ')}. Their original content is kept in the recovery journal (option devdaffi_replace_journal). Open and check them; they are skipped by new replacements until then.</div>}
                            {[
                               { key: 'ok', label: 'Live', badge: 'text-emerald-700 bg-emerald-50 border-emerald-200', iconColor: 'text-emerald-600', hoverBtn: 'text-emerald-600 hover:text-emerald-900', icon: <Check size={16} className="stroke-[3]" /> },
                               { key: 'oos', label: 'Out of Stock', badge: 'text-amber-700 bg-amber-50 border-amber-200', iconColor: 'text-amber-600', hoverBtn: 'text-amber-600 hover:text-amber-900', icon: <AlertCircle size={16} />, refreshable: true },
                               { key: 'dead', label: '404', badge: 'text-red-700 bg-red-50 border-red-200', iconColor: 'text-red-600', hoverBtn: 'text-red-600 hover:text-red-900', icon: <X size={16} strokeWidth={3} />, refreshable: true },
                            ].map(grp => {
                               const isLive = grp.key === 'ok';
                               const items = isLive ? liveState.items : monitorProblems.filter(p => p.status === grp.key);
                               const count = isLive ? monitorSummary.ok : (grp.key === 'oos' ? monitorSummary.oos : monitorSummary.dead);
                               const open = listOpen[grp.key] === true;
                               const q = (monitorSearch[grp.key] || '').trim().toLowerCase();
                               const shown = q ? items.filter(p => (p.asin || '').toLowerCase().includes(q)) : items;
                               // Pagination (per group) — default 10/page so a group never opens the whole page.
                               const mTotalPages = Math.max(1, Math.ceil(shown.length / monitorPerPage));
                               const mPage = Math.min(monitorPage[grp.key] || 1, mTotalPages);
                               const mStart = (mPage - 1) * monitorPerPage;
                               const mPaged = shown.slice(mStart, mStart + monitorPerPage);
                               const mShowingFrom = shown.length ? mStart + 1 : 0;
                               const mShowingTo = Math.min(mStart + monitorPerPage, shown.length);
                               const setMPage = (n) => setMonitorPage(s => ({ ...s, [grp.key]: n }));
                               const mPageItems = (() => {
                                  const out = []; const lo = Math.max(1, mPage - 1), hi = Math.min(mTotalPages, mPage + 1);
                                  if (lo > 1) { out.push(1); if (lo > 2) out.push('…'); }
                                  for (let i = lo; i <= hi; i++) out.push(i);
                                  if (hi < mTotalPages) { if (hi < mTotalPages - 1) out.push('…'); out.push(mTotalPages); }
                                  return out;
                               })();
                               const toggle = () => {
                                  const willOpen = !open;
                                  setListOpen(s => ({ ...s, [grp.key]: willOpen }));
                                  if (willOpen && isLive && !liveState.loaded) loadLive(false);
                               };
                               return (
                                  <div key={grp.key} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                                     <div className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50/80">
                                        <button type="button" onClick={toggle} className="flex items-center gap-3 min-w-0 text-left hover:opacity-90 transition-opacity">
                                           <span className={`inline-flex items-center ${grp.iconColor}`}>{grp.icon}</span>
                                           <span className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-md border whitespace-nowrap ${grp.badge}`}>
                                              {count} ASIN's {grp.label}
                                           </span>
                                           {grp.refreshable && (
                                              <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); if (count) runMonitor(grp.key); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); if (count) runMonitor(grp.key); } }} title={`Re-check ${grp.label} links. Fixed ones return to Live`} className={`inline-flex items-center ${grp.hoverBtn} ${(monitorRefresh === grp.key || !count || (svcUsage && svcUsage.state === 'connect')) ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}`}>
                                                 {monitorRefresh === grp.key ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                                              </span>
                                           )}
                                        </button>
                                        <div className="flex items-center gap-2 shrink-0">
                                           {open && (
                                              <>
                                                 <button type="button" onClick={() => { const t = shown.map(p => p.asin).join('\n'); if (t && navigator.clipboard) navigator.clipboard.writeText(t); }}
                                                    className="text-[11px] font-medium flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-100 px-2.5 py-1.5 rounded-md shadow-sm transition-colors">
                                                    <Copy size={12} /> Copy ASINs
                                                 </button>
                                                 <input type="text" placeholder="Search ASIN..." value={monitorSearch[grp.key] || ''}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={e => { setMonitorSearch(s => ({ ...s, [grp.key]: e.target.value })); setMPage(1); }}
                                                    className="h-[30px] w-36 px-2.5 text-xs bg-white border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                                              </>
                                           )}
                                           <button type="button" onClick={toggle} className="inline-flex items-center text-gray-400 hover:text-gray-600 transition-colors" title={open ? 'Collapse' : 'Expand'}>
                                              <ChevronDown size={16} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                                           </button>
                                        </div>
                                     </div>
                                     {open && (
                                        <div className="border-t border-gray-100">
                                           {/* Table */}
                                           <div className="max-h-[460px] overflow-y-auto custom-scrollbar">
                                              <table className="w-full text-left border-collapse">
                                                 <thead className="sticky top-0 z-10">
                                                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                                       <th className="px-4 py-2.5 text-left whitespace-nowrap">ASIN</th>
                                                       <th className="px-2 py-2.5 text-left whitespace-nowrap">Store</th>
                                                       <th className="px-2 py-2.5 text-left whitespace-nowrap">Pages</th>
                                                       <th className="px-4 py-2.5 text-left w-full">Product</th>
                                                    </tr>
                                                 </thead>
                                                 <tbody className="divide-y divide-slate-100 bg-white">
                                                    {isLive && liveState.loading && shown.length === 0 && (
                                                       <tr><td colSpan="4" className="px-4 py-4 text-sm text-gray-500"><span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading…</span></td></tr>
                                                    )}
                                                    {shown.length === 0 && !(isLive && liveState.loading) && (
                                                       <tr><td colSpan="4" className="px-4 py-6 text-center text-slate-400 italic">{q ? 'No matching ASINs.' : 'ASIN List Empty'}</td></tr>
                                                    )}
                                                    {mPaged.map(p => {
                                                       const ex = !!expandedProblems[p.asin];
                                                       const store = p.domain ? p.domain.replace(/^amazon/i, 'Amazon') : 'Amazon.com';
                                                       const pages = p.pages || [];
                                                       return (
                                                          <React.Fragment key={p.asin}>
                                                             <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpandedProblems(s => ({ ...s, [p.asin]: !s[p.asin] }))}>
                                                                <td className="px-4 py-2.5 whitespace-nowrap">
                                                                   <div className="flex items-center gap-2">
                                                                      <span className="font-mono text-[13px] font-bold text-gray-900 select-all cursor-text" onClick={e => e.stopPropagation()}>{p.asin}</span>
                                                                      <button type="button" onClick={(e) => { e.stopPropagation(); if (navigator.clipboard) navigator.clipboard.writeText(p.asin); }} title="Copy ASIN" className="text-gray-400 hover:text-indigo-600 transition-colors"><Copy size={13} /></button>
                                                                      <a href={p.amazon_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title="Open on Amazon" className="text-gray-400 hover:text-indigo-600 transition-colors"><ExternalLink size={13} /></a>
                                                                   </div>
                                                                </td>
                                                                <td className="px-2 py-2.5 text-[13px] font-semibold text-gray-800 whitespace-nowrap">{store}</td>
                                                                <td className="px-2 py-2.5 text-[13px] font-semibold text-gray-800 whitespace-nowrap tabular-nums">{pages.length}</td>
                                                                <td className="px-4 py-2.5 w-full">
                                                                   <div className="flex items-center justify-between gap-2">
                                                                      <span className={`text-[13px] truncate ${p.title ? 'text-gray-700' : 'text-gray-400 italic'}`} title={p.title || ''}>{p.title || 'title not available'}</span>
                                                                      <ChevronDown size={16} className={`shrink-0 text-gray-400 transition-transform ${ex ? 'rotate-180' : ''}`} />
                                                                   </div>
                                                                </td>
                                                             </tr>
                                                             {ex && (
                                                                <tr className="bg-gray-50/70">
                                                                   <td colSpan="4" className="px-4 py-3 border-t border-gray-100">
                                                                      <div className="text-[12px] space-y-3 animate-in fade-in duration-150">
                                                                         <div>
                                                                            <div className="font-semibold text-gray-500 mb-1.5">Replace this ASIN everywhere ({pages.length} page{pages.length === 1 ? '' : 's'}):</div>
                                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                               <input type="text" maxLength={10} placeholder="New ASIN" value={replaceVal[p.asin] || ''}
                                                                                  onChange={e => { const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); setReplaceVal(s => ({ ...s, [p.asin]: v })); }}
                                                                                  className="w-40 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg font-mono text-[12px] text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                                                               <button type="button" onClick={() => handleReplace(p.asin, pages.length)} disabled={replaceBusy === p.asin || (replaceVal[p.asin] || '').length !== 10 || (replaceVal[p.asin] || '') === p.asin || (svcUsage && svcUsage.state === 'connect')}
                                                                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[12px] font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                                                                                  {replaceBusy === p.asin ? <><Loader2 size={13} className="animate-spin" /> Replacing…</> : <><ArrowRightLeft size={13} /> Replace on {pages.length} page{pages.length === 1 ? '' : 's'}</>}
                                                                               </button>
                                                                            </div>
                                                                         </div>
                                                                         <div>
                                                                            {(() => {
                                                                               // Paginate the pages list so an ASIN used on 1000s of pages never renders all at once.
                                                                               const pp = monitorPerPage;
                                                                               const tp = Math.max(1, Math.ceil(pages.length / pp));
                                                                               const cp = Math.min(pagesPage[p.asin] || 1, tp);
                                                                               const st = (cp - 1) * pp;
                                                                               const pagedPages = pages.slice(st, st + pp);
                                                                               const setPP = (n) => setPagesPage(s => ({ ...s, [p.asin]: n }));
                                                                               return (
                                                                                  <>
                                                                                     <div className="font-semibold text-gray-500 mb-1">Used on {pages.length} page{pages.length === 1 ? '' : 's'}{tp > 1 ? ` (showing ${st + 1}-${Math.min(st + pp, pages.length)})` : ''}:</div>
                                                                                     <ul className="space-y-1 pr-1">
                                                                                        {pagedPages.map(pg => (
                                                                                           <li key={pg.post_id} className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-md px-2.5 py-1.5">
                                                                                              <a href={pg.permalink} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-indigo-700 truncate">{pg.title || '(untitled)'}</a>
                                                                                              {pg.edit_link && <a href={pg.edit_link} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800">Edit <ExternalLink size={11} /></a>}
                                                                                           </li>
                                                                                        ))}
                                                                                     </ul>
                                                                                     {tp > 1 && (
                                                                                        <div className="flex items-center justify-end gap-1 mt-2">
                                                                                           <button type="button" onClick={() => setPP(Math.max(1, cp - 1))} disabled={cp <= 1} className="px-2 py-0.5 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                                                                           <span className="text-gray-500 px-1">Page {cp} / {tp}</span>
                                                                                           <button type="button" onClick={() => setPP(Math.min(tp, cp + 1))} disabled={cp >= tp} className="px-2 py-0.5 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                                                                                        </div>
                                                                                     )}
                                                                                  </>
                                                                               );
                                                                            })()}
                                                                         </div>
                                                                      </div>
                                                                   </td>
                                                                </tr>
                                                             )}
                                                          </React.Fragment>
                                                       );
                                                    })}
                                                 </tbody>
                                              </table>
                                           </div>
                                           {shown.length > 0 && (
                                              <div className="px-4 py-2.5 border-t border-slate-200 bg-gray-50/50 flex flex-wrap justify-between items-center gap-2 text-xs text-gray-500">
                                                 <span>Showing <span className="font-semibold text-gray-700">{mShowingFrom}{mShowingTo > mShowingFrom ? '-' + mShowingTo : ''}</span> of <span className="font-semibold text-gray-700">{shown.length}</span>{isLive && liveState.hasMore ? '+' : ''}</span>
                                                 <div className="flex items-center gap-3">
                                                    {isLive && liveState.hasMore && mPage >= mTotalPages && (
                                                       <button type="button" onClick={() => loadLive(true)} disabled={liveState.loading} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50">
                                                          {liveState.loading ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />} Load more
                                                       </button>
                                                    )}
                                                    <div className="flex gap-1 items-center">
                                                       <button type="button" onClick={() => setMPage(Math.max(1, mPage - 1))} disabled={mPage <= 1} className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                                                       {mPageItems.map((it, idx) => it === '…' ? <span key={'e' + idx} className="px-1.5 text-slate-400">…</span> : (
                                                          <button key={it} type="button" onClick={() => setMPage(it)} className={`px-2 py-1 rounded border font-medium ${it === mPage ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 bg-white hover:bg-slate-100'}`}>{it}</button>
                                                       ))}
                                                       <button type="button" onClick={() => setMPage(Math.min(mTotalPages, mPage + 1))} disabled={mPage >= mTotalPages} className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
                                                       <span>Show</span>
                                                       <select value={monitorPerPage} onChange={(e) => { setMonitorPerPage(Number(e.target.value)); setMonitorPage({}); }} className="p-1 border border-slate-300 rounded bg-white outline-none focus:border-indigo-500 cursor-pointer">
                                                          {MON_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                                                       </select>
                                                    </div>
                                                 </div>
                                              </div>
                                           )}
                                        </div>
                                     )}
                                  </div>
                               );
                            })}

                            {monitorSummary.checked === 0 && (
                               <Hint text="No links checked yet. The scheduled scan verifies links in the background; counts will appear above once checks run." />
                            )}
                         </div>

                         {/* Redirects need the account: live checks flag OOS/404 and replacement search runs server-side. */}
                         {svcUsage && !svcUsage.usage && (
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                               <a href={svcUsage.connect_url} target="_top" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, borderRadius: '8px', padding: '10px 20px', textDecoration: 'none', cursor: 'pointer', lineHeight: 1, whiteSpace: 'nowrap', transition: '.12s', color: '#fff', background: '#2563eb', border: '1px solid #2563eb', boxShadow: '0 4px 10px -3px rgba(37,99,235,.5)' }} onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.borderColor = '#1d4ed8'; }} onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.borderColor = '#2563eb'; }}>Connect your DevDome account</a>
                               <span className="text-[13px] text-gray-500">Live checks run on DevDome servers. Requires a DevDome account.</span>
                            </div>
                         )}
                         {svcUsage && svcUsage.usage && (
                            <SettingRow label={`${(typeof svcUsage.usage.plan === 'string' && svcUsage.usage.plan ? svcUsage.usage.plan.charAt(0).toUpperCase() + svcUsage.usage.plan.slice(1) : 'Your')} Plan`} hint="Link checks used this month on your DevDome account." tooltip="The free plan includes 500 checks and searches per month, paid plans raise the limit. When the limit is reached, link statuses stay unchanged until next month, nothing on your site breaks.">
                               <div className="flex flex-wrap items-center gap-3 pt-2.5">
                                  <span className="text-sm font-bold text-gray-900">{svcUsage.usage.used.toLocaleString()} / {svcUsage.usage.limit.toLocaleString()}</span>
                                  {(svcUsage.state === 'quota' || svcUsage.usage.remaining === 0) ? (
                                     <a href="https://devdome.com/pricing" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-red-600 hover:text-red-800">Limit reached. Upgrade for more</a>
                                  ) : (
                                     svcUsage.usage.plan === 'free' && <a href="https://devdome.com/pricing" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Need more? See plans</a>
                                  )}
                               </div>
                            </SettingRow>
                         )}

                         <div className={svcUsage && !svcUsage.usage ? 'opacity-50 pointer-events-none' : ''}>
                         <SettingRow label="Out of Stock Redirect" hint="Send clicks on out of stock products somewhere useful." tooltip="When a product is out of stock, send the click to a fallback so the visit still has a chance to convert.">
                            <div className="flex flex-col gap-3">
                               <SimpleCheckbox name="monitorOosToSearch" checked={formData.monitorOosToSearch} onChange={handleCheckboxChange} label="Enable" />
                               {formData.monitorOosToSearch && (
                                  <RadioGroup name="monitorOosMode" value={formData.monitorOosMode} onChange={handleRadioChange} options={[
                                     { label: 'Best replacement product', value: 'replacement', hint: 'Send the click to the closest live product (falls back to the search page if none found).' },
                                     { label: 'Search page', value: 'search', hint: 'Send the click to Amazon search results for the product.' },
                                  ]} />
                               )}
                            </div>
                         </SettingRow>

                         <SettingRow label="404 ASIN Redirect" hint="Send clicks on removed products somewhere useful." tooltip="When a product page is gone (404), send the click to a fallback so the visit still has a chance to convert.">
                            <div className="flex flex-col gap-3">
                               <SimpleCheckbox name="monitorDeadToSearch" checked={formData.monitorDeadToSearch} onChange={handleCheckboxChange} label="Enable" />
                               {formData.monitorDeadToSearch && (
                                  <RadioGroup name="monitorDeadMode" value={formData.monitorDeadMode} onChange={handleRadioChange} options={[
                                     { label: 'Best replacement product', value: 'replacement', hint: 'Send the click to the closest live product (falls back to the search page if none found).' },
                                     { label: 'Search page', value: 'search', hint: 'Send the click to Amazon search results for the product.' },
                                  ]} />
                               )}
                            </div>
                         </SettingRow>
                         </div>
                     </div>
                  </div>
               </Section>
            </div>

            {/* --- Click Protection Section --- */}
            <div className={suiteMode ? 'mt-8' : 'py-6'}>
               <Section
                  title="Click Protection"
                  icon={Shield}
               >
                  <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
                    <SettingRow label="Bot Protection" hint="Keeps bot clicks out of your affiliate links and stats." tooltip="Basic protection: blocks known bots (Cloudflare verified-bot list) from triggering your affiliate links and inflating your click stats. For advanced, site-wide protection (datacenter & flagged-IP traffic, scanners and fake visits) install the DevDome Bot Protection plugin.">
                        <SimpleCheckbox name="blockBots" checked={formData.blockBots} onChange={handleCheckboxChange} label="Block Bot Clicks" />
                    </SettingRow>

                    <SettingRow label="Bots Blocked" hint="Bot clicks stopped so far." tooltip="Total bot clicks stopped before they reached your affiliate links. Resets only when you clear it.">
                        <div className="flex items-center gap-3 pt-1">
                          <span className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 font-bold text-sm">
                            <Shield size={15} className="stroke-[2.5]" /> {botsBlocked.toLocaleString()} blocked
                          </span>
                          <button type="button" onClick={handleResetBots} disabled={!botsBlocked} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-md text-xs font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                            <RotateCcw size={13} /> Reset Count
                          </button>
                        </div>
                    </SettingRow>

                    {formData.blockBots && (
                      <SettingRow label="Redirect Method" hint="How protected clicks reach Amazon." tooltip="JavaScript 302 keeps the referrer and works with caching plugins. Server side redirects are faster but some caches store them. Change it only if clicks are not being tracked.">
                          <RadioGroup
                            name="redirectMethod" value={formData.redirectMethod} onChange={handleRadioChange}
                            options={[
                              { label: 'JavaScript + 302 (Recommended)', value: 'js_302', hint: 'Fast for visitors. Acts as a second line of defense to catch unknown bots that slip past the main blocklist.' },
                              { label: 'JavaScript Only', value: 'js', hint: 'Aggressively filters out stealthy and unknown bots, but results in a slightly slower redirect for visitors.' },
                              { label: '302 Redirect Only', value: '302', hint: 'Fastest redirect. Relies solely on your main bot blocklist and skips the extra JavaScript filter.' }
                            ]}
                          />
                      </SettingRow>
                    )}


                  </div>
               </Section>
            </div>

            {/* --- Mobile App Section --- */}
            <div className={suiteMode ? 'mt-8' : 'py-6'}>
               <Section title="Mobile App" icon={Smartphone}>
                  <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
                     <SettingRow label="Enable Opener" hint="Opens the Amazon app on phones when possible." tooltip="Automatically launches the Amazon app on mobile devices when possible to bypass browser login walls and increase sales">
                        <div className="flex flex-col gap-2">
                           <SimpleCheckbox name="enabled" checked={formData.enabled} onChange={handleCheckboxChange} label="Open Amazon links in the Amazon app (mobile)" />
                        </div>
                     </SettingRow>

                     {formData.enabled && (
                       <>
                         <SettingRow label="iOS (iPhone/iPad)" hint="Shows an Open in Safari button inside in-app browsers." tooltip="If someone opens your site inside an in-app browser on iPhone (Reddit/Instagram/TikTok and similar), those browsers can block Amazon links. Turn this on to show a big Open in Safari button only in that situation. In normal Safari, links open normally with no extra step.">
                            <SimpleCheckbox name="iosOpenInSafari" checked={formData.iosOpenInSafari} onChange={handleCheckboxChange} label="On iPhone/iPad: show an “Open in Safari” button inside in-app browsers" />
                         </SettingRow>

                         <SettingRow label="Android" hint="How Android visitors reach Amazon." tooltip="Browser keeps the click in the visitor's browser. App tries the Amazon app first and falls back to the browser.">
                            <RadioGroup
                              name="androidMode" value={formData.androidMode} onChange={handleRadioChange}
                              options={[
                                { label: 'Web Only (Recommended)', value: 'browser', hint: 'Open the Amazon link normally (no forced app-open). If the Amazon app opens by itself on the user’s device, that’s fine. This is the smoothest and most reliable option.' },
                                { label: 'Force Amazon App (Intent)', value: 'intent', hint: 'Try to open the Amazon app first (if it’s installed). If the app doesn’t open, it automatically falls back to the Amazon page in the browser.' }
                              ]}
                            />
                         </SettingRow>
                       </>
                     )}
                  </div>
               </Section>
            </div>

            </>); return suiteMode && bottomTarget ? createPortal(bottomSections, bottomTarget) : bottomSections; })()}

            {!suiteMode && (
            <div className="sticky bottom-0 z-[150] bg-white/95 backdrop-blur-md px-8 py-2 flex flex-col sm:flex-row justify-start items-center border-t border-gray-200 gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-b-2xl">
              <button type="button" onClick={handleSave} disabled={saveState === 'saving' || !loaded} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 active:translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed">
                <Save className="w-4 h-4" /> {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved ✓' : saveState === 'error' ? 'Save failed. Retry' : !loaded ? 'Loading…' : 'Save Settings'}
              </button>
            </div>
            )}
            
          </form>
        </div>
      </div>
      </div>

      {/* MASSIVE ENTERPRISE EXCLUSIONS MODAL */}
      {exclusionModalType && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-5xl flex flex-col overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 h-[85vh] min-h-[600px]">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white relative z-40">
                <div className="flex items-center gap-3">
                   <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 shadow-sm"><Ban size={18} strokeWidth={2.5} /></div>
                   <div className="flex items-center gap-2">
                       <h2 className="text-lg font-bold text-gray-900 leading-tight">{exclusionModalType === 'tags' ? 'Affiliate Tag Excluded URLs' : 'Auto-Linker Excluded URLs'}</h2>
                       <InfoTooltip alignment="left" direction="bottom" text="URLs excluded here are strictly exact-match blocks. Select any specific URL or category page to block it universally." />
                   </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { if (!window.confirm('Remove every exclusion? They are gone once you save settings.')) return; setFormData(prev => ({...prev, globalExclusions: [], globalExcludedTrees: [], globalExceptions: [] })); setExclusionSelectedItems([]); }} className="flex items-center gap-1.5 text-[13px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors focus:outline-none hidden sm:flex">
                        <Eraser size={16} strokeWidth={2.5} /> Clear All Exclusions
                    </button>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/80 gap-4 relative z-30">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-wrap pb-1 sm:pb-0">
                    <div className="flex bg-gray-200/60 p-1 rounded-lg shrink-0">
                        <button onClick={() => { setExclusionTab('all'); setExclusionCurrentPage(1); setExclusionTypeFilter('All'); setExclusionSelectedItems([]); setExclusionLastSelected(null); }} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${exclusionTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>All URLs <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${exclusionTab === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-50 text-indigo-500'}`}>{targetOptions.length}</span></button>
                        <button onClick={() => { setExclusionTab('excluded'); setExclusionCurrentPage(1); setExclusionTypeFilter('All'); setExclusionSelectedItems([]); setExclusionLastSelected(null); }} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${exclusionTab === 'excluded' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Excluded URLs <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${exclusionTab === 'excluded' ? 'bg-red-100 text-red-700' : 'bg-red-50 text-red-500'}`}>{targetOptions.filter(opt => (formData.globalExclusions || []).includes(opt.value) || (formData.globalExcludedTrees || []).includes(opt.value) || (opt.parentCategory && (formData.globalExcludedTrees || []).includes(opt.parentCategory) && !(formData.globalExceptions || []).includes(opt.value))).length}</span></button>
                    </div>
                    <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filter:</span>
                        <StyledSelect name="exclusionTypeFilter" value={exclusionTypeFilter} onChange={(e) => { setExclusionTypeFilter(e.target.value); setExclusionCurrentPage(1); setExclusionSelectedItems([]); setExclusionLastSelected(null); }} wrapperClassName="min-w-max shrink-0" className="!py-1.5 !px-2.5 text-xs font-bold h-8 bg-white border border-gray-300 shadow-sm hover:border-indigo-400" truncate={false}>
                            <option value="All">All ({modalData?.tabCounts?.["All"] || 0})</option>
                            <option value="Page">Pages ({modalData?.tabCounts?.["Page"] || 0})</option>
                            <option value="Post Category">Post Categories ({modalData?.tabCounts?.["Post Category"] || 0})</option>
                            <option value="Post">Posts ({modalData?.tabCounts?.["Post"] || 0})</option>
                            <option value="Product Category">Product Categories ({modalData?.tabCounts?.["Product Category"] || 0})</option>
                            <option value="Product">Products ({modalData?.tabCounts?.["Product"] || 0})</option>
                        </StyledSelect>
                    </div>
                </div>
                <div className="flex items-center justify-end w-full sm:w-auto flex-1 shrink-0 ml-auto">
                    {showExclusionSearch ? (
                        <div className="relative animate-in fade-in zoom-in-95 duration-200 flex items-center w-full sm:max-w-[320px]">
                            <input
                                ref={exclusionSearchRef}
                                type="text"
                                value={exclusionSearch}
                                onChange={(e) => { setExclusionSearch(e.target.value); setExclusionCurrentPage(1); setExclusionSelectedItems([]); setExclusionLastSelected(null); }}
                                placeholder="Search pages, posts, products..."
                                className="w-full pl-8 pr-8 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-gray-700 outline-none h-8"
                            />
                            <Search className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none" size={13} />
                            <button type="button" onClick={() => { setShowExclusionSearch(false); setExclusionSearch(''); setExclusionCurrentPage(1); setExclusionSelectedItems([]); setExclusionLastSelected(null); }} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"><X size={14} /></button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowExclusionSearch(true)}
                            className="flex items-center justify-center p-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm shrink-0 h-8 w-8"
                            title="Search exclusions"
                        >
                            <Search size={14} className="text-indigo-500" />
                        </button>
                    )}
                </div>
             </div>

             <div className="flex-1 overflow-y-auto bg-gray-50/50 custom-scrollbar p-0 relative" ref={modalScrollRef}>
                {(() => {
                   if (!modalData.hasMatches || modalData.totalItems === 0) return (
                      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                         <Ban size={36} className="text-gray-300 mb-4" />
                         <p className="text-sm font-bold text-gray-700">{exclusionTab === 'excluded' && exclusionSearch === '' && exclusionTypeFilter === 'All' ? 'No exclusions yet.' : 'No items found.'}</p>
                         <p className="text-xs text-gray-500 mt-1.5 max-w-xs mb-6 leading-relaxed">{exclusionTab === 'excluded' && exclusionSearch === '' && exclusionTypeFilter === 'All' ? "Search and exclude URLs in the 'All URLs' tab." : 'Try adjusting your search terms or filters.'}</p>
                         {(exclusionSearch || exclusionTypeFilter !== 'All') && <button onClick={() => { setExclusionSearch(''); setExclusionTypeFilter('All'); setExclusionCurrentPage(1); setExclusionSelectedItems([]); setExclusionLastSelected(null); }} className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 text-xs font-bold rounded-lg transition-colors border border-indigo-200 shadow-sm">Clear Search & Filters</button>}
                      </div>
                   );

                   const renderModalItem = (item) => {
                      const isExplicitlyExcluded = (formData.globalExclusions || []).includes(item.value);
                      const isTreeExcluded = (formData.globalExcludedTrees || []).includes(item.value);
                      const isParentTreeExcluded = item.parentCategory && (formData.globalExcludedTrees || []).includes(item.parentCategory);
                      const isException = (formData.globalExceptions || []).includes(item.value);
                      
                      // Allows explicit exceptions to visually break through tree blocks
                      const isEffectivelyExcluded = isExplicitlyExcluded || ((isTreeExcluded || isParentTreeExcluded) && !isException);
                      
                      const isSelected = exclusionSelectedItems.includes(item.value);
                      const assignedRuleIndex = formData.btn1AffiliateRules.findIndex(r => r.ruleValues && r.ruleValues.includes(item.value));
                      const rowBg = isSelected ? 'bg-indigo-50/60' : isException ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : (isParentTreeExcluded || isTreeExcluded) ? 'bg-amber-50/20' : isExplicitlyExcluded ? 'bg-red-50/30' : 'bg-white hover:bg-gray-50';

                      return (
                         <div key={item.value} className={`relative px-4 py-2.5 transition-colors border-b border-gray-100/70 last:border-0 flex flex-col sm:flex-row items-start justify-between group gap-3 sm:gap-4 ${rowBg}`}>
                            <div className="flex items-start gap-3 flex-1 min-w-0 pr-4 relative z-10">
                               <div className="pt-[5px] shrink-0" onClick={(e) => e.stopPropagation()}>
                                   <input type="checkbox" checked={isSelected} onChange={(e) => {
                                           if (e.nativeEvent.shiftKey && exclusionLastSelected) {
                                               const currentIndex = modalData.currentItems.findIndex(i => i.value === item.value);
                                               const lastIndex = modalData.currentItems.findIndex(i => i.value === exclusionLastSelected);
                                               if (currentIndex !== -1 && lastIndex !== -1) {
                                                   const itemsInRange = modalData.currentItems.slice(Math.min(currentIndex, lastIndex), Math.max(currentIndex, lastIndex) + 1).map(i => i.value);
                                                   setExclusionSelectedItems(prev => { const newSet = new Set(prev); isSelected ? itemsInRange.forEach(val => newSet.delete(val)) : itemsInRange.forEach(val => newSet.add(val)); return Array.from(newSet); });
                                                   setExclusionLastSelected(item.value); return;
                                               }
                                           }
                                           let newSet = new Set(exclusionSelectedItems);
                                           if (isSelected) { newSet.delete(item.value); } else { newSet.add(item.value); }
                                           setExclusionSelectedItems(Array.from(newSet)); setExclusionLastSelected(item.value);
                                       }} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 cursor-pointer shadow-sm" />
                               </div>
                               <div className="flex-1 min-w-0 pt-[2px]">
                                   <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span className={`text-sm font-semibold truncate transition-all ${isEffectivelyExcluded ? 'text-gray-500/80' : 'text-gray-900'}`}>{item.label}</span>
                                      {isTreeExcluded && <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-red-100 text-red-700" title="This entire category is globally excluded."><FolderTree size={10} strokeWidth={3} /> Category Excluded</span>}
                                      {isExplicitlyExcluded && !isTreeExcluded && <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-red-100 text-red-700" title="This specific URL is globally excluded."><Ban size={10} strokeWidth={3} /> URL Excluded</span>}
                                      {isParentTreeExcluded && !isException && <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-amber-100 text-amber-700" title="Excluded because its parent category is excluded."><Ban size={10} strokeWidth={3} /> Excluded (Via {targetOptions.find(t => t.value === item.parentCategory)?.label || 'Category'})</span>}
                                      {item.childCount > 0 && <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border ${isEffectivelyExcluded ? 'text-gray-400 bg-gray-50 border-gray-200' : 'text-sky-600 bg-sky-50 border-sky-100'}`}><FileText size={10} /> {item.childCount} {item.childLabel}</span>}
                                      {item.linkCount > 0 && <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shadow-sm border border-indigo-100" title={`${item.linkCount} Amazon links found in this`}><LinkIcon size={10} /> {item.linkCount} Amazon Links</span>}
                                      {isException && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200/50 shrink-0 shadow-sm">Exception</span>}
                                      {assignedRuleIndex !== -1 && !isEffectivelyExcluded && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200/50 shrink-0 shadow-sm flex items-center gap-1"><TagIcon size={9} /> Assigned to Tag #{assignedRuleIndex + 1}</span>}
                                   </div>
                                   {item.link && <div className="flex items-center gap-1.5"><span className={`text-[12px] font-medium font-mono truncate transition-all ${isEffectivelyExcluded ? 'text-gray-400/70' : 'text-gray-500'}`}>{item.link}</span><a href={item.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`hover:text-blue-600 transition-colors shrink-0 ${isEffectivelyExcluded ? 'text-gray-300' : 'text-gray-400'}`}><ExternalLink size={13} /></a></div>}
                               </div>
                            </div>
                            
                            {exclusionSelectedItems.length === 0 && (
                                item.type.includes('Category') ? (
                                    <div className="flex items-center gap-1.5 shrink-0 mt-1 sm:mt-0 relative z-10 ml-[28px] sm:ml-0">
                                        <button onClick={(e) => { e.stopPropagation(); toggleExclusion(item, isParentTreeExcluded && !isException && !isExplicitlyExcluded ? 'exception' : 'url'); }} 
                                            className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-colors border shadow-sm ${isExplicitlyExcluded || (isParentTreeExcluded && !isException) ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' : 'bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200'}`}>
                                            {isExplicitlyExcluded || (isParentTreeExcluded && !isException) ? 'Restore Category URL' : 'Exclude Category URL'}
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); toggleExclusion(item, isParentTreeExcluded && !isTreeExcluded ? 'exception_tree' : 'tree'); }} 
                                            className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-colors border shadow-sm ${isTreeExcluded || (isParentTreeExcluded && !isException) ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' : 'bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200'}`}>
                                            {isTreeExcluded || (isParentTreeExcluded && !isException) ? 'Restore Entire Category' : 'Exclude Entire Category'}
                                        </button>
                                    </div>
                                ) : (
                                    isParentTreeExcluded ? (
                                        <button onClick={(e) => { e.stopPropagation(); toggleExclusion(item, 'exception'); }} className={`shrink-0 mt-1 sm:mt-0 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors border shadow-sm relative z-10 ml-[28px] sm:ml-0 ${isException ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' : 'bg-white border-gray-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200'}`}>
                                            {isException ? 'Remove Exception' : 'Add Exception'}
                                        </button>
                                    ) : (
                                        <button onClick={(e) => { e.stopPropagation(); toggleExclusion(item, 'url'); }} className={`shrink-0 mt-1 sm:mt-0 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors border shadow-sm relative z-10 ml-[28px] sm:ml-0 ${isExplicitlyExcluded ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' : 'bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700'}`}>
                                            {isExplicitlyExcluded ? 'Restore URL' : 'Exclude URL'}
                                        </button>
                                    )
                                )
                            )}
                         </div>
                      );
                   };

                   return (
                     <div className={exclusionSelectedItems.length > 0 ? "pb-24" : ""}>
                       {sortedTypes.map(type => {
                           const groupItems = grouped[type];
                           const selectableGroupValues = groupItems.map(i => i.value);
                           const isAllSelected = selectableGroupValues.length > 0 && selectableGroupValues.every(v => exclusionSelectedItems.includes(v));
                           const isSomeSelected = selectableGroupValues.some(v => exclusionSelectedItems.includes(v)) && !isAllSelected;

                           return (
                               <div key={type} className="relative">
                                   <div className="px-4 py-1.5 bg-gray-100/95 backdrop-blur-sm text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 border-t first:border-t-0 sticky top-0 z-20 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-3">
                                       <input type="checkbox" checked={isAllSelected} ref={el => { if (el) el.indeterminate = isSomeSelected; }} onChange={() => { if (isAllSelected) setExclusionSelectedItems(prev => prev.filter(v => !selectableGroupValues.includes(v))); else setExclusionSelectedItems(prev => [...new Set([...prev, ...selectableGroupValues])]); }} className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 cursor-pointer shadow-sm" /><span>{getTypeLabel(type)}</span>
                                   </div>
                                   <div className="flex flex-col bg-white">{groupItems.map(renderModalItem)}</div>
                               </div>
                           );
                       })}
                     </div>
                   );
                })()}
             </div>

             {exclusionSelectedItems.length > 0 && (() => {
                 const canExcludeUrlsBtn = exclusionSelectedItems.some(val => !formData.globalExclusions.includes(val));
                 const canRestoreUrlsBtn = exclusionSelectedItems.some(val => formData.globalExclusions.includes(val));
                 
                 const selectedCategories = exclusionSelectedItems.filter(val => getOptionData(val)?.type.includes('Category'));
                 const canExcludeCategoriesBtn = selectedCategories.some(val => !formData.globalExcludedTrees.includes(val));
                 const canRestoreCategoriesBtn = selectedCategories.some(val => formData.globalExcludedTrees.includes(val));

                 return (
                     <div className="absolute bottom-[80px] right-6 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-wrap items-center gap-3 sm:gap-4 z-[120] animate-in slide-in-from-bottom-6 duration-300 border border-gray-700/50 w-[90%] sm:w-auto sm:max-w-2xl justify-center">
                         <div className="flex items-center gap-2"><span className="flex items-center justify-center bg-indigo-500 text-white w-5 h-5 rounded-full text-[10px] font-bold">{exclusionSelectedItems.length}</span><span className="text-xs font-bold text-gray-200 whitespace-nowrap hidden sm:block">Selected</span></div>
                         <div className="w-px h-5 bg-gray-700"></div>
                         
                         <div className="flex items-center gap-2 flex-wrap justify-center">
                             {canExcludeUrlsBtn && (
                                 <button onClick={() => {
                                     setFormData(prev => {
                                         const exclusions = new Set(prev.globalExclusions || []); 
                                         const exceptions = new Set(prev.globalExceptions || []);
                                         let rules = [...prev.btn1AffiliateRules];
                                         const hit = rules.some(r => (r.ruleValues || []).some(v => exclusionSelectedItems.includes(v)));
                                         if (hit && !window.confirm('Some of these targets are assigned to tag rules. Excluding them removes them from those rules (not restored when you un-exclude). Continue?')) return prev; // round 4
                                         exclusionSelectedItems.forEach(val => { 
                                            exclusions.add(val);
                                            exceptions.delete(val);
                                            rules = rules.map(r => ({ ...r, ruleValues: (r.ruleValues || []).filter(v => v !== val) })); 
                                         });
                                         return { ...prev, globalExclusions: [...exclusions], globalExceptions: [...exceptions], btn1AffiliateRules: rules };
                                     }); 
                                     setExclusionSelectedItems([]);
                                 }} className="text-[11px] sm:text-[12px] font-bold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap flex items-center gap-1.5">
                                     <Ban size={14} /> Exclude URLs
                                 </button>
                             )}
                             
                             {canExcludeCategoriesBtn && (
                                 <button onClick={() => {
                                     setFormData(prev => {
                                         const excludedTrees = new Set(prev.globalExcludedTrees || []);
                                         const exclusions = new Set(prev.globalExclusions || []);
                                         let exceptions = [...(prev.globalExceptions || [])];
                                         let rules = [...prev.btn1AffiliateRules];

                                         const affectedAll = [];
                                         exclusionSelectedItems.forEach(val => { if (getOptionData(val)?.type.includes('Category')) { affectedAll.push(val, ...targetOptions.filter(t => t.parentCategory === val).map(t => t.value)); } });
                                         const hitCat = rules.some(r => (r.ruleValues || []).some(v => affectedAll.includes(v)));
                                         if (hitCat && !window.confirm('Some of these categories (or posts in them) are assigned to tag rules. Excluding them removes them from those rules (not restored when you un-exclude). Continue?')) return prev; // round 4
                                         exclusionSelectedItems.forEach(val => {
                                             if (getOptionData(val)?.type.includes('Category')) {
                                                 excludedTrees.add(val);
                                                 exclusions.delete(val);
                                                 const children = targetOptions.filter(t => t.parentCategory === val).map(t => t.value);
                                                 exceptions = exceptions.filter(v => v !== val && !children.includes(v)); // round 7: the category itself leaves the exceptions too
                                                 rules = rules.map(r => ({ ...r, ruleValues: (r.ruleValues || []).filter(v => v !== val && !children.includes(v)) }));
                                             }
                                         });
                                         return { ...prev, globalExcludedTrees: [...excludedTrees], globalExclusions: [...exclusions], globalExceptions: exceptions, btn1AffiliateRules: rules };
                                     });
                                     setExclusionSelectedItems([]);
                                 }} className="text-[11px] sm:text-[12px] font-bold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap flex items-center gap-1.5">
                                     <FolderTree size={14} /> Exclude Categories
                                 </button>
                             )}
                             
                             {canRestoreUrlsBtn && (
                                 <button onClick={() => {
                                     setFormData(prev => {
                                         const exclusions = new Set(prev.globalExclusions || []);
                                         const excludedTrees = new Set(prev.globalExcludedTrees || []);
                                         const exceptions = new Set(prev.globalExceptions || []);
                                         exclusionSelectedItems.forEach(val => { 
                                            exclusions.delete(val); 
                                            if (excludedTrees.has(val) || (targetOptions.find(t => t.value === val)?.parentCategory && excludedTrees.has(targetOptions.find(t => t.value === val).parentCategory))) {
                                                exceptions.add(val);
                                            }
                                         });
                                         return { ...prev, globalExclusions: [...exclusions], globalExceptions: [...exceptions] };
                                     }); 
                                     setExclusionSelectedItems([]);
                                 }} className="text-[11px] sm:text-[12px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap flex items-center gap-1.5">
                                     <RotateCcw size={14} /> Restore URLs
                                 </button>
                             )}
                             
                             {canRestoreCategoriesBtn && (
                                 <button onClick={() => {
                                     setFormData(prev => {
                                         const excludedTrees = new Set(prev.globalExcludedTrees || []);
                                         const exclusions = new Set(prev.globalExclusions || []);
                                         const exceptions = new Set(prev.globalExceptions || []);
                                         exclusionSelectedItems.forEach(val => {
                                             if (getOptionData(val)?.type.includes('Category')) {
                                                 excludedTrees.delete(val);
                                                 exclusions.delete(val);
                                                 exceptions.delete(val);
                                                 const children = targetOptions.filter(t => t.parentCategory === val).map(t => t.value);
                                                 children.forEach(child => exceptions.delete(child));
                                             }
                                         });
                                         return { ...prev, globalExcludedTrees: [...excludedTrees], globalExclusions: [...exclusions], globalExceptions: [...exceptions] };
                                     });
                                     setExclusionSelectedItems([]);
                                 }} className="text-[11px] sm:text-[12px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap flex items-center gap-1.5">
                                     <RotateCcw size={14} /> Restore Categories
                                 </button>
                             )}
                         </div>
                         
                         <div className="w-px h-5 bg-gray-700"></div>
                         <button onClick={() => setExclusionSelectedItems([])} className="text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-1.5 rounded-full"><X size={14} /></button>
                     </div>
                 );
             })()}

             <div className="flex items-center justify-between bg-white px-5 py-4 border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] w-full gap-4 flex-wrap sm:flex-nowrap">
               <div className="flex items-center gap-4 shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-start">
                   <div className="text-[13px] text-gray-600 whitespace-nowrap">Showing <span className="font-bold text-gray-900">{modalData.totalItems > 0 ? `${modalData.startIndex + 1}-${modalData.endIndex}` : '0'}</span> of <span className="font-bold text-gray-900">{modalData.totalItems}</span> items</div>
                   {modalData.totalItems > 0 && (
                       <div className="flex items-center gap-4">
                         <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
                         <div className="flex gap-1.5 items-center">
                           <button onClick={() => { setExclusionCurrentPage(p => Math.max(1, p - 1)); setExclusionLastSelected(null); }} disabled={modalData.safePage === 1} className="px-3 py-1 text-[13px] rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Prev</button>
                           {(() => {
                              const pages = [];
                              let startPage = Math.max(1, modalData.safePage - 2), endPage = Math.min(modalData.totalPages, startPage + 4);
                              if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
                              for (let i = startPage; i <= endPage; i++) pages.push(i);
                              return (
                                <>
                                  {startPage > 1 && <span className="text-[13px] text-gray-400 px-1 hidden sm:inline">...</span>}
                                  {pages.map(pageNum => (<button key={pageNum} onClick={() => { setExclusionCurrentPage(pageNum); setExclusionLastSelected(null); }} className={`px-3 py-1 text-[13px] rounded-md border font-medium transition-colors ${pageNum === modalData.safePage ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}>{pageNum}</button>))}
                                  {endPage < modalData.totalPages && <span className="text-[13px] text-gray-400 px-1 hidden sm:inline">...</span>}
                                </>
                              );
                           })()}
                           <button onClick={() => { setExclusionCurrentPage(p => Math.min(modalData.totalPages, p + 1)); setExclusionLastSelected(null); }} disabled={modalData.safePage === modalData.totalPages} className="px-3 py-1 text-[13px] rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                         </div>
                          <div className="items-center gap-2 border-l border-gray-200 pl-4 hidden sm:flex">
                             <span className="text-[13px] text-gray-600">Show</span>
                             <input type="number" value={exclusionItemsPerPage} onChange={(e) => { const val = parseInt(e.target.value, 10); if (!isNaN(val) && val > 0) { setExclusionItemsPerPage(val); setExclusionCurrentPage(1); setExclusionLastSelected(null); } else if (e.target.value === '') setExclusionItemsPerPage(''); }} onBlur={(e) => { if (e.target.value === '' || parseInt(e.target.value, 10) < 1) { setExclusionItemsPerPage(50); setExclusionCurrentPage(1); setExclusionLastSelected(null); } }} className="w-12 py-1 px-1.5 border border-gray-300 rounded-md text-[13px] focus:border-indigo-500 outline-none text-center" min="1" />
                             <span className="text-[13px] text-gray-600">per page</span>
                          </div>
                       </div>
                   )}
               </div>
               <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                   <span className="text-xs font-medium text-gray-400">Applied when you save settings</span>
                   <button onClick={handleCloseModal} className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">Close</button>
               </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}