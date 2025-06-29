import TableGenerique from "@/components/table/tablegeneric";

const ArticleList = () => {
    return (
        <div>
            <h1>Articles</h1>
            <TableGenerique
                isLoading={false}
                isError={false}
                data={[]}
                columns={[]}
            />
        </div>
    );
};
export default ArticleList;