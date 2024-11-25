import { FC } from 'react'
import { BookOpen } from 'lucide-react'

interface QuizProps {
  // 添加需要的props
}

const Quiz: FC<QuizProps> = () => {
  return (
    <div>
      <h2 className="flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        AI出题
      </h2>
      {/* AI出题组件的具体实现 */}
    </div>
  )
}

export default Quiz 