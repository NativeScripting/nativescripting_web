export function replaceAttribute(childNodes: NodeList, attributeName: string, replaceAttributeName: string) {
    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.nodeType === 1) {
            const el = <HTMLElement>node;
            if (el.hasAttribute('data-z-test')) {
                const temp = 0;
            }
            if (el.hasAttribute('data-ko-ignore')) {
                const attrVal = el.getAttribute(attributeName);
                el.removeAttribute(attributeName);
                delete el.attributes[attributeName];
                el.setAttribute(replaceAttributeName, attrVal);
            }
            replaceAttribute(el.childNodes, attributeName, replaceAttributeName);
        }
    }
}


export function removeAttribute(childNodes: NodeList, attributeName: string) {
    const ret = [];
    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.nodeType === 1) {
            const el = <HTMLElement>node;
            if (el.hasAttribute('data-z-test')) {
                const temp = 0;
            }

            if (!el.hasAttribute('data-ko-keep')) {
                el.removeAttribute(attributeName);
            }
            const toBeRemoved = removeAttribute(el.childNodes, attributeName);
            toBeRemoved.forEach((n: Node) => {
                el.removeChild(n);
            });
        } else if (node.nodeType === 8) {
            ret.push(node);
        }
    }
    return ret;
}