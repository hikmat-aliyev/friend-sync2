import './PostsSkeleton.css'

function PostsSkeleton() {
  return(
    <div className="posts-skeleton">

        <div className='post-skeleton'>
          <div className='post-header-skeleton'>
            <img className='profile-image skeleton' />
            <div >
              <h1 className='profile-name skeleton' ></h1>
              <h3 className='post-date skeleton'></h3>
            </div>
          </div>

          <div className='post-body-skeleton'>
            <div className='skeleton'></div>
            <div className='skeleton'></div>
            <div className='skeleton'></div>
            <div className='skeleton'></div>
          </div>
        </div>

        <div className='post-skeleton'>
          <div className='post-header-skeleton'>
            <img className='profile-image skeleton' />
            <div >
              <h1 className='profile-name skeleton' ></h1>
              <h3 className='post-date skeleton'></h3>
            </div>
          </div>

          <div className='post-body-skeleton'>
            <div className='skeleton'></div>
            <div className='skeleton'></div>
            <div className='skeleton'></div>
            <div className='skeleton'></div>
          </div>
        </div>

        <div className='post-skeleton'>
          <div className='post-header-skeleton'>
            <img className='profile-image skeleton' />
            <div >
              <h1 className='profile-name skeleton' ></h1>
              <h3 className='post-date skeleton'></h3>
            </div>
          </div>

          <div className='post-body-skeleton'>
            <div className='skeleton'></div>
            <div className='skeleton'></div>
            <div className='skeleton'></div>
            <div className='skeleton'></div>
          </div>
        </div>


    </div>
  )
}

export default PostsSkeleton;