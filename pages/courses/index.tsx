import { NextPage } from 'next'
import CourseList from '~/components/CourseList'
import Header from '~/components/Header'

const CoursesPage: NextPage<{
  showSignIn: (show: boolean) => void
}> = ({ showSignIn }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-3xl font-bold text-transparent">
            课程广场
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            探索精选课程，开启你的学习之旅
          </p>
        </div>
        <CourseList />
      </main>
    </div>
  )
}

export default CoursesPage 