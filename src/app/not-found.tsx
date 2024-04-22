import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex min-h-96 justify-center items-center'>
      <div className='flex flex-col items-center'>
        <h1 className='text-4xl font-bold'>404</h1>
        <h2 className='text-2xl font-semibold'>Page Not Found</h2>
        <Link href='/' className='text-blue-500 mt-4'>
          Go back home
        </Link>
      </div>
    </div>
  )
}
