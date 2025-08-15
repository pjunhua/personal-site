/*
    How to use LinkInP:
    || = split a link from the main string
    ^^ = split a link from the text to be used as the hyperlink

    E.g. You can learn more about it from ||this^^www.example.com|| website!

    IMPORTANT: Wrap textPara in {}, otherwise any \n won't be recognized and treated as a literal string.
    E.g. <LinkInP textPara={"Text\nNew Line"} /> as opposed to <LinkInP textPara="Text\nNew Line" />
*/

import React, {forwardRef} from 'react';

interface LinkInPProps {
    textPara: string,
    brighterLink?: boolean,
    style?: React.CSSProperties,
    className?: string
}

const LinkInP = forwardRef<HTMLParagraphElement, LinkInPProps>(({textPara, brighterLink, style, className}, ref) => {
    const textArray = textPara.split('||');
    return (
        <p ref={ref} style={{...style, whiteSpace: 'pre-line'}} className={className}>
            {
                textArray.map((text) => {
                    const textSplit = text.split('^^');
                    const hasLink: boolean = textSplit.length > 1;
                    if (hasLink) {
                        return <a href={textSplit[1]} target='_blank' rel='noopener noreferrer' style={brighterLink ? { color: '#7dcfff' } : undefined}>{textSplit[0]}</a>
                    } else {
                        return textSplit[0];
                    }
                })
            }
        </p>
    )
})

export default LinkInP;