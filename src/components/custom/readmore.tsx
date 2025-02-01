import { useState } from "react";

interface ReadMoreProps {
    text: string | undefined | null;
    maxLength?: number;
    charsPerLine?: number;
}

const ReadMore: React.FC<ReadMoreProps> = ({ 
    text, 
    maxLength = 30,
    charsPerLine = 100 
}) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => setIsReadMore(!isReadMore);

    if (!text) {
        return null;
    }

    const formatTextWithLineBreaks = (text: string) => {
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + ' ' + word).length <= charsPerLine) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.join('\n');
    };

    const displayText = isReadMore 
        ? formatTextWithLineBreaks(text.slice(0, maxLength))
        : formatTextWithLineBreaks(text);

    return (
        <p className="text whitespace-pre-line">
            {displayText}
            {text.length > maxLength && (
                <span
                    onClick={toggleReadMore}
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                    {isReadMore ? "...read more" : " show less"}
                </span>
            )}
        </p>
    );
};

export default ReadMore;