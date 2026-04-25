import * as TabsPrimitive from '@radix-ui/react-tabs';

const TABS = [
  { value: 'all',         label: 'All' },
  { value: 'bundle',      label: 'Bundles' },
  { value: 'fragrance',   label: 'Fragrance' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'watches',     label: 'Watches' },
  { value: 'bags',        label: 'Bags' },
  { value: 'clothing',    label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'sports',      label: 'Sports' },
  { value: 'toys',        label: 'Toys' },
];

export function CategoryTabs({ active, onChange, counts, total }) {
  const available = TABS.filter(t => t.value === 'all' || counts[t.value] > 0);

  return (
    <TabsPrimitive.Root value={active} onValueChange={onChange}>
      <TabsPrimitive.List className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {available.map(tab => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className="whitespace-nowrap px-4 py-2 text-[11px] font-black tracking-widest uppercase rounded-lg border transition-all duration-200 cursor-pointer outline-none"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--muted-foreground)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              if (e.currentTarget.dataset.state !== 'active') {
                e.currentTarget.style.color = 'var(--foreground)';
                e.currentTarget.style.borderColor = 'var(--ring)';
              }
            }}
            onMouseLeave={e => {
              if (e.currentTarget.dataset.state !== 'active') {
                e.currentTarget.style.color = 'var(--muted-foreground)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }
            }}
            data-active-style="true"
          >
            {tab.label}
            {tab.value === 'all' ? ` (${total})` : counts[tab.value] ? ` (${counts[tab.value]})` : ''}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      <style>{`
        [data-radix-collection-item][data-state="active"] {
          background: var(--primary) !important;
          color: var(--primary-foreground) !important;
          border-color: var(--primary) !important;
          box-shadow: 0 0 14px rgba(52,211,153,0.3);
        }
      `}</style>
    </TabsPrimitive.Root>
  );
}
