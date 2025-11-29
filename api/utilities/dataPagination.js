const dataPagination = async (modelFunc, page=1, limit=5, populatedFileds=[], sortingConfig={ fieldName: 'createdAt', sortType: 'ascending' }) => {
    const sortOption = {}
    if (sortingConfig?.fieldName !== '') {
        sortOption[sortingConfig.fieldName] = sortingConfig.sortType === 'descending' ? -1 : 1
    }
    const skip = (page - 1) * limit; 
    const pageConfig = [
        { $skip: skip },
        { $limit: limit }
    ]
    const totalDocCounts = [{ $count: 'count' }]

    const aggregationPipeline = [
        { $sort: sortOption },
        { $facet: { data: [...populatedFileds, ...pageConfig], totalCount: totalDocCounts } }
    ];
    const result = await modelFunc.aggregate(aggregationPipeline);
    const filteredData = result[0].data;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const hasMore = skip + filteredData.length < totalCount;

    return { filteredData, hasMore, totalCount }
}

export default dataPagination