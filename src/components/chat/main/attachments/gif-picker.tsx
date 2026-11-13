import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IconSearch, IconX, IconSparkles } from "@tabler/icons-react"
import { cn } from "cn"

export interface GifPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectGif: (gifUrl: string, title?: string) => void
  children?: React.ReactNode
}

interface GifItem {
  id: string
  title: string
  previewUrl: string
  fullUrl: string
}

const CATEGORIES = [
  "Trending",
  "Reactions",
  "Cheers",
  "Laugh",
  "Clap",
  "Love",
  "Cat",
  "Dancing",
  "Sad",
]

// Rich instant curated library with looping animated GIFs across every category
const CURATED_GIFS: Record<string, GifItem[]> = {
  Trending: [
    {
      id: "tr_1",
      title: "Thumbs Up",
      previewUrl: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
      fullUrl: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
    },
    {
      id: "tr_2",
      title: "Mind Blown",
      previewUrl: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
      fullUrl: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
    },
    {
      id: "tr_3",
      title: "Excited Dance",
      previewUrl: "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif",
      fullUrl: "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif",
    },
    {
      id: "tr_4",
      title: "Clapping Leo",
      previewUrl: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
      fullUrl: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
    },
    {
      id: "tr_5",
      title: "Popcorn",
      previewUrl: "https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif",
      fullUrl: "https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif",
    },
    {
      id: "tr_6",
      title: "Yes Office",
      previewUrl: "https://media.giphy.com/media/n4oKYFlAcv2AU/giphy.gif",
      fullUrl: "https://media.giphy.com/media/n4oKYFlAcv2AU/giphy.gif",
    },
    {
      id: "tr_7",
      title: "Shocked Cat",
      previewUrl: "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
      fullUrl: "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
    },
    {
      id: "tr_8",
      title: "Happy Dance",
      previewUrl: "https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif",
      fullUrl: "https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif",
    },
  ],
  Reactions: [
    {
      id: "re_1",
      title: "Confused Travolta",
      previewUrl: "https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif",
      fullUrl: "https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif",
    },
    {
      id: "re_2",
      title: "Nodding Yes",
      previewUrl: "https://media.giphy.com/media/NEvPzZ8bdvV4Y/giphy.gif",
      fullUrl: "https://media.giphy.com/media/NEvPzZ8bdvV4Y/giphy.gif",
    },
    {
      id: "re_3",
      title: "Facepalm",
      previewUrl: "https://media.giphy.com/media/3og0INyCmHlNylks9O/giphy.gif",
      fullUrl: "https://media.giphy.com/media/3og0INyCmHlNylks9O/giphy.gif",
    },
    {
      id: "re_4",
      title: "Wink",
      previewUrl: "https://media.giphy.com/media/6ra84UsoIZ9AIA3KZ3/giphy.gif",
      fullUrl: "https://media.giphy.com/media/6ra84UsoIZ9AIA3KZ3/giphy.gif",
    },
    {
      id: "re_5",
      title: "Eye Roll",
      previewUrl: "https://media.giphy.com/media/Rhhr8D5mKSXL9cXoyn/giphy.gif",
      fullUrl: "https://media.giphy.com/media/Rhhr8D5mKSXL9cXoyn/giphy.gif",
    },
    {
      id: "re_6",
      title: "Shrug",
      previewUrl: "https://media.giphy.com/media/KanqCs2oHZHkyQPlIo/giphy.gif",
      fullUrl: "https://media.giphy.com/media/KanqCs2oHZHkyQPlIo/giphy.gif",
    },
  ],
  Cheers: [
    {
      id: "ch_1",
      title: "Great Gatsby",
      previewUrl: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
      fullUrl: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
    },
    {
      id: "ch_2",
      title: "Beer Cheers",
      previewUrl: "https://media.giphy.com/media/Zw3oBUuIg23EWnuvW8/giphy.gif",
      fullUrl: "https://media.giphy.com/media/Zw3oBUuIg23EWnuvW8/giphy.gif",
    },
    {
      id: "ch_3",
      title: "Champagne Toast",
      previewUrl: "https://media.giphy.com/media/BPJmthQ3YRwD6QqcVD/giphy.gif",
      fullUrl: "https://media.giphy.com/media/BPJmthQ3YRwD6QqcVD/giphy.gif",
    },
    {
      id: "ch_4",
      title: "Celebration Fireworks",
      previewUrl: "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif",
      fullUrl: "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif",
    },
  ],
  Laugh: [
    {
      id: "la_1",
      title: "LOL Ryan Gosling",
      previewUrl: "https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif",
      fullUrl: "https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif",
    },
    {
      id: "la_2",
      title: "Office Laugh",
      previewUrl: "https://media.giphy.com/media/ltIFdjNAasOwVvKhvx/giphy.gif",
      fullUrl: "https://media.giphy.com/media/ltIFdjNAasOwVvKhvx/giphy.gif",
    },
    {
      id: "la_3",
      title: "Wheeze Laugh",
      previewUrl: "https://media.giphy.com/media/Q7ozWVYCR0nyW2rvPW/giphy.gif",
      fullUrl: "https://media.giphy.com/media/Q7ozWVYCR0nyW2rvPW/giphy.gif",
    },
    {
      id: "la_4",
      title: "Giggle Dog",
      previewUrl: "https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/giphy.gif",
      fullUrl: "https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/giphy.gif",
    },
  ],
  Clap: [
    {
      id: "cl_1",
      title: "Slow Clap Citizen Kane",
      previewUrl: "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif",
      fullUrl: "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif",
    },
    {
      id: "cl_2",
      title: "Minions Clapping",
      previewUrl: "https://media.giphy.com/media/pubcv2SSmYpj2/giphy.gif",
      fullUrl: "https://media.giphy.com/media/pubcv2SSmYpj2/giphy.gif",
    },
    {
      id: "cl_3",
      title: "Friends Clapping",
      previewUrl: "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif",
      fullUrl: "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif",
    },
    {
      id: "cl_4",
      title: "Standing Ovation",
      previewUrl: "https://media.giphy.com/media/nbvFVPiEiJH6JOGIok/giphy.gif",
      fullUrl: "https://media.giphy.com/media/nbvFVPiEiJH6JOGIok/giphy.gif",
    },
  ],
  Love: [
    {
      id: "lv_1",
      title: "Heart Eyes",
      previewUrl: "https://media.giphy.com/media/uw0KqTWZPAhuU/giphy.gif",
      fullUrl: "https://media.giphy.com/media/uw0KqTWZPAhuU/giphy.gif",
    },
    {
      id: "lv_2",
      title: "Blowing Kiss",
      previewUrl: "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif",
      fullUrl: "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif",
    },
    {
      id: "lv_3",
      title: "Cat Love",
      previewUrl: "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
      fullUrl: "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
    },
    {
      id: "lv_4",
      title: "Sending Love",
      previewUrl: "https://media.giphy.com/media/26FLdm964upuji3pg/giphy.gif",
      fullUrl: "https://media.giphy.com/media/26FLdm964upuji3pg/giphy.gif",
    },
  ],
  Cat: [
    {
      id: "ct_1",
      title: "Pop Cat",
      previewUrl: "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif",
      fullUrl: "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif",
    },
    {
      id: "ct_2",
      title: "Keyboard Cat",
      previewUrl: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
      fullUrl: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
    },
    {
      id: "ct_3",
      title: "Vibing Cat",
      previewUrl: "https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif",
      fullUrl: "https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif",
    },
    {
      id: "ct_4",
      title: "Cat Head Tilt",
      previewUrl: "https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif",
      fullUrl: "https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif",
    },
  ],
  Dancing: [
    {
      id: "dc_1",
      title: "Carlton Dance",
      previewUrl: "https://media.giphy.com/media/pa37AAGzKXoek/giphy.gif",
      fullUrl: "https://media.giphy.com/media/pa37AAGzKXoek/giphy.gif",
    },
    {
      id: "dc_2",
      title: "Snoop Dogg Dance",
      previewUrl: "https://media.giphy.com/media/wAxlCmeX1ri1y/giphy.gif",
      fullUrl: "https://media.giphy.com/media/wAxlCmeX1ri1y/giphy.gif",
    },
    {
      id: "dc_3",
      title: "Baby Groot Dance",
      previewUrl: "https://media.giphy.com/media/10UeedrT5MIfPG/giphy.gif",
      fullUrl: "https://media.giphy.com/media/10UeedrT5MIfPG/giphy.gif",
    },
    {
      id: "dc_4",
      title: "Party Parrot",
      previewUrl: "https://media.giphy.com/media/l3q2zVr6ET95U3ITm/giphy.gif",
      fullUrl: "https://media.giphy.com/media/l3q2zVr6ET95U3ITm/giphy.gif",
    },
  ],
  Sad: [
    {
      id: "sd_1",
      title: "Crying Michael Jordan",
      previewUrl: "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif",
      fullUrl: "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif",
    },
    {
      id: "sd_2",
      title: "Rain Sad",
      previewUrl: "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif",
      fullUrl: "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif",
    },
    {
      id: "sd_3",
      title: "Puppy Eyes",
      previewUrl: "https://media.giphy.com/media/BEob5qwFkSJ7G/giphy.gif",
      fullUrl: "https://media.giphy.com/media/BEob5qwFkSJ7G/giphy.gif",
    },
    {
      id: "sd_4",
      title: "Pikachu Crying",
      previewUrl: "https://media.giphy.com/media/L95W4wvxxkYjdAQx56/giphy.gif",
      fullUrl: "https://media.giphy.com/media/L95W4wvxxkYjdAQx56/giphy.gif",
    },
  ],
}

// Flat search index across all curated gifs
function searchCuratedGifs(query: string): GifItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return CURATED_GIFS.Trending

  const matches: GifItem[] = []
  const seen = new Set<string>()

  for (const [category, items] of Object.entries(CURATED_GIFS)) {
    const catMatch = category.toLowerCase().includes(q)
    for (const item of items) {
      if (seen.has(item.id)) continue
      if (catMatch || item.title.toLowerCase().includes(q)) {
        seen.add(item.id)
        matches.push(item)
      }
    }
  }

  // If no direct keyword matches, return trending
  return matches.length > 0 ? matches : CURATED_GIFS.Trending
}

async function fetchGifs(searchTerm: string, isTrending: boolean): Promise<GifItem[]> {
  // If no search query, return instantly from curated category without delay or network
  if (isTrending || !searchTerm) {
    return CURATED_GIFS.Trending
  }

  if (CURATED_GIFS[searchTerm]) {
    return CURATED_GIFS[searchTerm]
  }

  // Attempt public fetch or fall back immediately to curated search
  try {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(
      searchTerm
    )}&limit=24&rating=g`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1200) // Fast 1.2s timeout

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (res.ok) {
      const json = await res.json()
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((item: any) => ({
          id: item.id,
          title: item.title || "GIF",
          previewUrl:
            item.images?.fixed_width_small?.url ||
            item.images?.fixed_width?.url ||
            item.images?.original?.url,
          fullUrl: item.images?.fixed_width?.url || item.images?.original?.url,
        }))
      }
    }
  } catch {
    // network or api banned, smoothly fall through
  }

  return searchCuratedGifs(searchTerm)
}

export function GifPicker({ open, onOpenChange, onSelectGif, children }: GifPickerProps) {
  const [query, setQuery] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("Trending")

  // Debounce search query so typing doesn't fire excessive requests
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 200)
    return () => clearTimeout(handler)
  }, [query])

  const effectiveTerm = debouncedQuery || activeCategory
  const isTrending = !debouncedQuery && activeCategory === "Trending"

  // React Query cached query: instant initialData guarantees ZERO loading spinners when opening dialog
  const { data } = useQuery({
    queryKey: ["giphy", isTrending ? "trending" : effectiveTerm],
    queryFn: () => fetchGifs(effectiveTerm, isTrending),
    staleTime: Infinity, // Keep in memory forever for the session
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection retention
    initialData: () => {
      if (isTrending) return CURATED_GIFS.Trending
      if (CURATED_GIFS[effectiveTerm]) return CURATED_GIFS[effectiveTerm]
      return searchCuratedGifs(effectiveTerm)
    },
    enabled: open,
  })

  const gifs: GifItem[] = data && data.length > 0 ? data : CURATED_GIFS.Trending

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={children as React.ReactElement} />

      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="w-[320px] sm:w-[360px] p-0 rounded-2xl shadow-2xl border border-border/80 bg-background/95 backdrop-blur-md overflow-hidden flex flex-col max-h-[420px]"
      >
        {/* Search header */}
        <div className="p-3 border-b space-y-2 bg-muted/20">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all GIFs via Giphy..."
              className="w-full h-8 pl-8 pr-7 rounded-xl bg-background border border-border/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary/80 transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <IconX className="size-3" />
              </button>
            )}
          </div>

          {/* Categories Pill Strip */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat)
                  setQuery("")
                }}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-colors cursor-pointer select-none",
                  activeCategory === cat && !query
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GIFs Grid */}
        <div className="flex-1 overflow-y-auto p-2.5 min-h-[240px] max-h-[300px] no-scrollbar">
          {gifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-1 text-xs text-muted-foreground">
              <IconSparkles className="size-5 opacity-40 mb-1" />
              <span>No GIFs found for "{query}"</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() => {
                    onSelectGif(gif.fullUrl, gif.title)
                    onOpenChange(false)
                  }}
                  className="group relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted/60 hover:opacity-95 transition-all cursor-pointer border border-border/40 focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={gif.previewUrl}
                    alt={gif.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5 text-left">
                    <span className="text-[10px] text-white truncate font-medium">
                      {gif.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Giphy Attribution Footer */}
        <div className="px-3 py-1.5 border-t bg-muted/30 flex items-center justify-between text-[10px] text-muted-foreground select-none">
          <span>Powered by GIPHY</span>
          <span className="opacity-60">Click to send</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default GifPicker

