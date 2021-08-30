import React from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import HeadData from "../components/HeadData.js";
import { Calendar } from "../components/SVG.js";
import SiteMetaData from "../components/SiteMetadata.js";
import { FindCategory, FillSpace, LinkFix } from "../components/SimpleFunctions.js";
export const BlogPostTemplate = (props) => {
  const { frontmatter, link, tocdata, body } = props;
  const { title: siteName, ads, disqus } = SiteMetaData();
  const adCodes = ads?.adCodes;
  const [btT, setBtT] = useState("");
  const contentRef = useRef(null);
  const [topOffset, setTopOffset] = useState(900000000);
  const { base: img, name: imgName, childImageSharp } = frontmatter.featuredimage;
  const { width, height } = childImageSharp.original;
  const disqusConfig = {
    url: link,
    title: frontmatter.title,
  };
  const showAds = ads?.enableAds && !ads?.disabledPostsAds?.includes(frontmatter.slug);

  const scrollTop = () => {
    typeof window !== "undefined" &&
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };

  const backToTop = () => {
    window.scrollY > 300 ? setBtT("active") : setBtT("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", backToTop);

      setTopOffset(contentRef.current.offsetTop + contentRef.current.offsetHeight - 1000);

      return () => window.removeEventListener("scroll", backToTop);
    }
  }, [frontmatter.tableofcontent]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ea = document.querySelectorAll("a[href^='#']");
      const r = (e) => {
        e.preventDefault();
        const o = e.target.getAttribute("href").substring(1);
        if (document.getElementById(o)) {
          const e = window.scrollY + document.getElementById(o).getBoundingClientRect().top - 20;
          window.scrollTo({ top: e, behavior: "smooth" });
        }
      };
      for (const t of ea) {
        t.addEventListener("click", r);
      }
      return () => {
        for (const t of ea) {
          t.removeEventListener("click", r);
        }
      };
    }
  }, []);

  return (
    <>
      <section className="section blog-post">
        <button onClick={() => scrollTop()} className={`btp ${btT}`}>
          <TopArrow />
        </button>
        <div className="container content">
          <div className="blog-columns">
            <div className="column is-9">
              <div className="blog-section-top entry-content">
                {!frontmatter.hidefeaturedimage && (
                  <picture className="blog-top-img">
                    <source media="(min-width:768px)" srcSet={`/image/post-first/${imgName}.webp`} />
                    <source media="(min-width:100px)" srcSet={`/image/post-first/${imgName}-m.webp`} />
                    <img src={`/img/${img}`} alt={frontmatter.title} loading="lazy" width={width} height={height} />
                  </picture>
                )}
                <div className="blog-section-top-inner">
                  <h1 className="title entry-title">{frontmatter.title}</h1>
                  <BlogInfo date={frontmatter.date} disqusConfig={disqusConfig} disqus={disqus} title={frontmatter.title} image={img} />
                  <MDXProvider components={PostComps}>
                    <MDXRenderer>{frontmatter.beforebody}</MDXRenderer>
                  </MDXProvider>
                </div>
              </div>
              {frontmatter.tableofcontent && !!tocdata.length && <PostComps.TableOfContents data={tocdata} />}
              {showAds && <div className="ads-toc" dangerouslySetInnerHTML={{ __html: adCodes?.afterToC }} />}
              {frontmatter.table?.table && frontmatter.table?.title && !!frontmatter.products?.length && <PostComps.PTitle title={frontmatter.table?.title} cName="is-bold is-center" />}
              {frontmatter.table?.table && !!frontmatter.products?.length && <PostComps.ProductsTable products={frontmatter.products} headTitle={frontmatter.table?.headTitle} productColumns={frontmatter.table.productColumns} title={frontmatter.table?.seoTitle} />}
              <div ref={contentRef} className="post-content">
                <MDXProvider components={PostComps}>
                  <MDXRenderer>{body}</MDXRenderer>
                </MDXProvider>
                {!!frontmatter.products?.length && (
                  <div className="products">
                    {frontmatter.products?.map((item, index) => (
                      <div className="product-box" key={index}>
                        <PostComps.PTitle hlevel="3" title={item.name} />
                        {item.image && <PostComps.PImage alt={item.name} src={item.image.base} link={item.link} />}
                        {!!item.specs?.length && <PostComps.SpecTable spec={item.specs} />}
                        <MDXProvider components={PostComps}>
                          <MDXRenderer>{item.body}</MDXRenderer>
                        </MDXProvider>
                        {(!!item.pros?.length || !!item.cons?.length) && <PostComps.ProsNCons pros={item.pros} cons={item.cons} />}
                        <PostComps.BButton link={item.link} title={item.btnText} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="blog-section-bottom">
                <MDXProvider components={PostComps}>
                  <MDXRenderer>{frontmatter.afterbody}</MDXRenderer>
                </MDXProvider>
              </div>
              {!!frontmatter.faq?.length && (
                <div className="post-faq">
                  <h2 className="faq-title">Frequently Asked Questions</h2>
                  {frontmatter.faq.map((item, index) => (
                    <div className="faq-question" key={index}>
                      <h3 className="faq-ques">{item.ques}</h3>
                      <p className="faq-ans">{item.ans}</p>
                    </div>
                  ))}
                </div>
              )}
              {frontmatter.rating && <RatingBox count={frontmatter.rcount} value={frontmatter.rvalue} />}
              {showAds && <div className="ads-author" dangerouslySetInnerHTML={{ __html: adCodes?.beforeAuthor }} />}
              <Author authorID={frontmatter.author} />
              {disqus && (
                <div id="disqus_thread">
                  <LazyLoad offsetTop={topOffset}>
                    <DiscussionEmbed config={disqusConfig} shortname={disqus} />
                  </LazyLoad>
                </div>
              )}
            </div>
            <div className="column is-3">
              <div className="sidebar" id="sidebar" itemType="https://schema.org/WPSideBar" itemScope="itemscope">
                <div className="site-info">
                  <p>{siteName} is reader-supported. When you buy through links on our site, we may earn an affiliate commission.</p>
                </div>
                <Search />
                <SidebarLatestPosts />
                <SidebarTableofContents data={frontmatter.sidebar} ad={showAds && <div className="ads-sidebar" dangerouslySetInnerHTML={{ __html: adCodes?.sidebarSticky }} />} />
              </div>
            </div>
          </div>
          <LatestPosts />
        </div>
      </section>
      {showAds && <div className="ads-mobile" dangerouslySetInnerHTML={{ __html: adCodes?.stickyMobile }} />}
    </>
  );
};
const IndexTemplate = ({ data }) => {
  const singlePost = data.FP.nodes[0];
  const otherPosts = data.OP.nodes;
  const allPosts = data.posts.nodes;
  const sections = data.allMarkdownRemark.categories
    .map((category) => {
      const posts = allPosts.filter((post) => post.frontmatter.category === category.frontmatter.id).slice(0, 6);
      return { title: category.frontmatter.title, posts };
    })
    .filter((category) => category.posts.length);
  const { seoTitle: title, seoDescription: description } = data.markdownRemark.frontmatter;
  const { siteURL, title: siteName, number, facebook, youtube, twitter, logoLarge } = SiteMetaData();
  const homeCategories = data.markdownRemark.frontmatter.categories;

  const websiteSchema = `{
      "@context":"https://schema.org",
      "@type":"WebSite",
      "@id":"${siteURL}/#website",
      "headline":"${title}",
      "name":"${siteName}",
      "description":"${description}",
      "url":"${siteURL}",
      "potentialAction":{
        "@type":"SearchAction",
        "target":"${siteURL}/?s={search_term_string}",
        "query-input":"required name=search_term_string"
      }
    }`;

  const newsMediaSchema = `{
        "@context":"https://schema.org",
        "@type":"NewsMediaOrganization",
        "@id":"${siteURL}/#Organization",
        "name":"${siteName}",
        "url":"${siteURL}",
        "sameAs":[
          "${facebook}",
          "${youtube}",
          "${twitter}"
        ],
        "logo":{
          "@type":"ImageObject",
          "url":"${siteURL}/img/${logoLarge.base}",
          "width":"800",
          "height":"258"
        },
        "contactPoint":{
          "@type":"ContactPoint",
          "contactType":"customer support",
          "telephone":"${number}",
          "url":"${siteURL}/contact-us/"
        }
    }`;

  return (
    <Layout>
      <section className="section index">
        <HeadData title={title} description={description} schema={`[${websiteSchema}, ${newsMediaSchema}]`} />
        <div className="container content">
          <div className="index-latest-title">
            <h2>Latest Posts</h2>
          </div>
          <div className="index-top-section">
            {singlePost && <FirstPost post={singlePost} />}
            <OtherPosts posts={otherPosts} />
          </div>
          <div className="index-bottom-section">
            <Sections sections={sections} />
            {!!homeCategories.length && (
              <div className="index-categories">
                <div className="index-latest-title">
                  <h2>Categories</h2>
                </div>
                <div className="index-inner-categories">
                  {homeCategories.map((item, index) => (
                    <div className="index-category" key={index}>
                      <h2>{item.title}</h2>
                      <div className="category-links">
                        {item.links?.map((item, index) => (
                          <div className="category-link" key={index}>
                            <Link to={LinkFix(item)}>{item.title}</Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

IndexTemplate.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

const FirstPost = ({ post }) => {
  const { title, category, date } = post.frontmatter;
  const { name: imgName, base: img } = post.frontmatter.featuredimage;
  const { width, height } = post.frontmatter.featuredimage.childImageSharp.original;
  const slug = post.fields.slug;
  const { categoryName, categoryLink } = FindCategory(category);

  return (
    <div className="first-post">
      <div className="first-post-thumbnail">
        <Link to={`${slug}/`}>
          <picture>
            <source media="(min-width:768px)" srcSet={`/image/front-first/${imgName}.webp`} />
            <source media="(min-width:100px)" srcSet={`/image/post-first/${imgName}-m.webp`} />
            <img src={`/img/${img}`} alt={title} loading="lazy" width={width} height={height} />
          </picture>
        </Link>
      </div>
      <div className="first-post-info">
        <div className="post-info-category">
          <Link to={`${categoryLink}/`}>{categoryName}</Link>
        </div>
        <div className="post-info-title">
          <Link to={`${slug}/`}>{title}</Link>
        </div>
        <div className="post-info-date">
          <Calendar />
          {date}
        </div>
      </div>
    </div>
  );
};

const OtherPosts = ({ posts }) => (
  <div className="other-posts">
    {posts.map((post, index) => {
      const { title, category } = post.frontmatter;
      const { name: imgName, base: img } = post.frontmatter.featuredimage;
      const { width, height } = post.frontmatter.featuredimage.childImageSharp.original;
      const slug = post.fields.slug;
      const { categoryName, categoryLink } = FindCategory(category);

      return (
        <div className="other-post" key={index}>
          <div className="other-post-thumbnail">
            <Link to={`${slug}/`}>
              <picture>
                <source srcSet={`/image/front-right/${imgName}.webp`} />
                <img src={`/img/${img}`} alt={title} loading="lazy" width={width} height={height} />
              </picture>
            </Link>
          </div>
          <div className="other-post-info">
            <div className="post-info-category">
              <Link to={`${categoryLink}/`}>{categoryName}</Link>
            </div>
            <div className="post-info-title">
              <Link to={`${slug}/`}>{title}</Link>
            </div>
            <div className="post-info-date">{post.frontmatter.date}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const Sections = ({ sections }) => {
  return (
    <div className="category-sections">
      {sections.map((category, index) => (
        <div className="category-section" key={index}>
          <div className="index-latest-title">
            <h2>{category.title}</h2>
          </div>
          <div className="index-columns">
            {category.posts.map((post, index) => {
              const { title } = post.frontmatter;
              const { name: imgName, base: img } = post.frontmatter.featuredimage;
              const { width, height } = post.frontmatter.featuredimage.childImageSharp.original;
              const slug = post.fields.slug;

              return (
                <div className="index-column" key={index}>
                  <div className="index-col-image">
                    <Link to={`${slug}/`}>
                      <picture>
                        <source srcSet={`/image/latest/${imgName}.webp`} />
                        <img src={`/img/${img}`} alt={title} loading="lazy" width={width} height={height} />
                      </picture>
                    </Link>
                  </div>
                  <div className="index-box-title">
                    <Link to={`${slug}/`}>{title}</Link>
                  </div>
                </div>
              );
            })}
            {FillSpace(category.posts.length)}
          </div>
        </div>
      ))}
    </div>
  );
};

export const IndexQuery = graphql`
  query IndexQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        seoTitle
        seoDescription
        categories {
          title
          links {
            title
            link
          }
        }
      }
    }
    FP: allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(fromNow: true)
          category
          featuredimage {
            name
            base
            childImageSharp {
              original {
                height
                width
              }
            }
          }
        }
      }
    }
    OP: allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 3, skip: 1) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(fromNow: true)
          category
          featuredimage {
            name
            base
            childImageSharp {
              original {
                height
                width
              }
            }
          }
        }
      }
    }
    posts: allMdx(sort: { order: DESC, fields: [frontmatter___date] }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          category
          featuredimage {
            name
            base
            childImageSharp {
              original {
                height
                width
              }
            }
          }
        }
      }
    }
    allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "category-page" } } }) {
      categories: nodes {
        fields {
          slug
        }
        frontmatter {
          id
          title
        }
      }
    }
  }
`;

export default IndexTemplate;