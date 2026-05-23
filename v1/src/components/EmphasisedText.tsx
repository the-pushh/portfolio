import { cn } from "../utils";

export const EmphasisedText = ({ text, className }: { text: string, className?: string }) => (
  <p className={cn("", className)}>{text.split("*").map((sub: string, index: number) => {
    if( index % 2 == 0) {
      return <span key={index}>{sub}</span>;
    } else {
      return <span key={index} className="font-bold">{sub}</span>
    }
  })}</p>
)