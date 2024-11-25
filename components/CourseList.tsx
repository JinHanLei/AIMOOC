import { Book, Clock, Star, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  duration: string
  students: number
  rating: number
  imageUrl: string
}

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Python 基础入门到实战',
    description: '从零开始学习 Python 编程，掌握核心概念和实践技能',
    category: '编程开发',
    level: '入门',
    duration: '20小时',
    students: 1234,
    rating: 4.8,
    imageUrl: '/course-images/python.jpg',
  },
  {
    id: '2',
    title: '数据结构与算法精讲',
    description: '系统学习常用数据结构和算法，提升编程能力',
    category: '计算机科学',
    level: '进阶',
    duration: '30小时',
    students: 892,
    rating: 4.9,
    imageUrl: '/course-images/algorithm.jpg',
  },
  {
    id: '3',
    title: 'Web 全栈开发实战',
    description: '前后端完整技术栈，从入门到实际项目开发',
    category: '全栈开发',
    level: '中级',
    duration: '40小时',
    students: 1567,
    rating: 4.7,
    imageUrl: '/course-images/web.jpg',
  },
]

export default function CourseList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {MOCK_COURSES.map((course) => (
        <Link
          key={course.id}
          href={`/courses/${course.id}`}
          className="group relative overflow-hidden rounded-lg border bg-white/50 p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50"
        >
          <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            <div className="flex h-full items-center justify-center text-gray-500">
              <Book className="h-10 w-10" />
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {course.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {course.description}
            </p>
            
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students.toLocaleString()}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span>{course.rating}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                {course.category}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                {course.level}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 