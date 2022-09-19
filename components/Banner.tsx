function Banner() {
  return (
    <div className="mx-auto flex max-w-7xl items-center bg-yellow-400 py-10">
      <div className="space-y-5 px-10">
        <h1 className="max-w-xl font-serif text-6xl">
          <span className="underline decoration-black decoration-4">
            Medium
          </span>{' '}
          is a place to write, read, and connect
        </h1>

        <h2>
          It`s easy and free to post your thinking on any topic and connect
          with millions of renders.
        </h2>
      </div>
      <img
        src="/logo-2.png"
        alt="logo-2"
      />
    </div>
  )
}

export default Banner;
