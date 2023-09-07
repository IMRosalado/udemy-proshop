import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

type PaginateProps = {
  pages: number,
  currentPage: number,
  isAdmin?: boolean,
  keyword?: string
}

const Paginate = ({ pages, currentPage, isAdmin = false, keyword }:PaginateProps) => {

  const searchPath = keyword? `/search/${keyword}` : ""
  return <>
    {(pages > 1) && (
      <Pagination>
        { [...Array(pages).keys()].map(x => (
          <LinkContainer key={x+1} to={!isAdmin? `${searchPath}/page/${x+1}` :  `/admin/products${searchPath}/page/${x+1}`}>
            <Pagination.Item active={x+1 === currentPage}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
      )}
  </>
  
}

export default Paginate