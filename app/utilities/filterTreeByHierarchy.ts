interface TreeNode {
    heirarchy: number;
    children?: TreeNode[];
    [key: string]: string | number | boolean | TreeNode[] | undefined;
}

const filterTreeByHierarchy = (tree: TreeNode[], level: number): TreeNode[] => {
    return tree.filter(node => node.heirarchy === 0 || node.heirarchy >= level).map(node => {
        if (node.children) {
            const filteredChildren = filterTreeByHierarchy(node.children, level)

            // return node with filtered children
            return {
                ...node,
                children: filteredChildren.length > 0 ? filteredChildren : undefined
            }
        }

        return node
    })
}
export default filterTreeByHierarchy;