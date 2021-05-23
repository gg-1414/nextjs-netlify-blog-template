import BlogBasicLayout from "../../components/BlogBasicLayout";

export type Props = {
  heading: string;
}

export default function Post({
  heading
}: Props) {
  return (
    <div>Blog sub page - Post</div>
    // <BlogBasicLayout
    //   heading={heading}
    // >

    // </BlogBasicLayout>
  )
}