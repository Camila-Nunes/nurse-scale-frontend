interface ContentProps {
  children: any
}

export default function Content(props: ContentProps) {
  return (
      <div className={`
          flex items-start justify-start flex-1 p-4
          text-3xl
      `}>
          {props.children}
      </div>
  )
}