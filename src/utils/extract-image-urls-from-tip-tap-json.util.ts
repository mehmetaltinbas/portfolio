export function extractImageUrlsFromTipTapJson(node: any): Set<string> {
    const urls = new Set<string>();
    if (!node) return urls;

    if (node.type === 'image' && node.attrs?.src) {
        urls.add(node.attrs.src);
    }

    if (Array.isArray(node.content)) {
        for (const child of node.content) {
            for (const url of extractImageUrlsFromTipTapJson(child)) {
                urls.add(url);
            }
        }
    }

    return urls;
}
