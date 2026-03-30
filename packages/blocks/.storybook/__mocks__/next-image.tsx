const NextImage = ({ src, alt, fill, ...props }: any) => (
  <img
    src={src}
    alt={alt}
    style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : undefined}
    {...props}
  />
)
export default NextImage
