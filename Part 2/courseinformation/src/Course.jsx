const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>total of {sum} exercises</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  const sum = parts.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exercises, 0
  )

  return (
    <>
      {parts.map(part =>
        <Part key={part.id} part={part}/>
      )}
      <Total sum = {sum}/>
    </>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header course='Half Stack application development'/>
      <Content parts={course.parts}/>
    </>
  )
}

export default Course