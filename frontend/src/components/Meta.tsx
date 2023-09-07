import { Helmet } from "react-helmet-async"

type MetaProps = {
  title: string,
  description: string,
  keywords: string
}
const Meta = ( { title, description, keywords }: MetaProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta name="keywords" content={keywords}></meta>
    </Helmet>
  )
}

Meta.defaultProps = {
  title: "Welcome to Proshop",
  description: "We sell the best products for cheap",
  keywords: "electronics, buy electronics, cheap electronics"
}

export default Meta