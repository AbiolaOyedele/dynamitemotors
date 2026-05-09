export type Service = {
  _id: string
  title: string
  slug: { current: string }
  description: string | null
  icon: string | null
  features: string[] | null
}
