import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconChartBar, IconPlus, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export interface CreatePollModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreatePoll: (question: string, options: string[], allowMultiple: boolean) => void
}

export function CreatePollModal({ open, onOpenChange, onCreatePoll }: CreatePollModalProps) {
  const [question, setQuestion] = React.useState("")
  const [options, setOptions] = React.useState<string[]>(["", ""])
  const [allowMultiple, setAllowMultiple] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setQuestion("")
      setOptions(["", ""])
      setAllowMultiple(false)
    }
  }, [open])

  const handleOptionChange = (idx: number, val: string) => {
    setOptions((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }

  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions((prev) => [...prev, ""])
    }
  }

  const handleRemoveOption = (idx: number) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((_, i) => i !== idx))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validQuestion = question.trim()
    const validOptions = options.map((o) => o.trim()).filter(Boolean)

    if (!validQuestion || validOptions.length < 2) return

    onCreatePoll(validQuestion, validOptions, allowMultiple)
    onOpenChange(false)
  }

  const canSubmit = question.trim().length > 0 && options.filter((o) => o.trim()).length >= 2

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-md gap-0 rounded-3xl border border-border/80 bg-background shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <DialogHeader className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconChartBar className="size-4" />
              </div>
              <DialogTitle className="text-sm font-semibold text-foreground">Create a poll</DialogTitle>
            </div>
          </DialogHeader>

          {/* Form Body */}
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Question Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Question</label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full h-9 rounded-xl border border-border/80 bg-muted/30 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary/80 transition-colors"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Options</label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 h-8 rounded-xl border border-border/80 bg-muted/20 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary/80 transition-colors"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg cursor-pointer"
                        title="Remove option"
                      >
                        <IconTrash className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 8 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddOption}
                  className="w-full h-8 text-xs gap-1.5 text-primary hover:text-primary/90 mt-1 cursor-pointer"
                >
                  <IconPlus className="size-3.5" />
                  <span>Add option</span>
                </Button>
              )}
            </div>

            {/* Settings: Allow Multiple */}
            <label className="flex items-center gap-2.5 pt-2 border-t border-border/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
                className="size-4 rounded accent-primary cursor-pointer"
              />
              <span className="text-xs text-foreground font-medium">Allow multiple answers</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-3 bg-muted/30 border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!canSubmit}
              className="bg-primary text-primary-foreground cursor-pointer"
            >
              Create Poll
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePollModal
