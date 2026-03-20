import React from 'react'
import { Route, Switch } from 'react-router-dom'

import ClassTableForm from './ClassTableForm'
import FilterForm from './FilterForm'
import PlanForm from './PlanForm'
import SemesterNav from './SemesterNav'
import { useToolbar } from './ToolbarContext'

export default function Toolbar() {
  const {
    filterFormState,
    setFilterFormState,
    starLesson,
    setStarLesson,
    selectedLesson,
    setSelectedLesson,
    sjtuLesson,
    sjtuLessonLoading,
    syncFromISJTU,
    removeStarLesson,
    colorize,
  } = useToolbar()

  return (
    <div className='container'>
      <Switch>
        <Route exact path='/'>
          <SemesterNav />
        </Route>
        <Route path='/:semester/:path'>
          <SemesterNav />
          <hr />
        </Route>
      </Switch>
      <Switch>
        <Route path='/:semester/browse'>
          <FilterForm state={filterFormState} setState={setFilterFormState} />
        </Route>
        <Route path='/:semester/plan'>
          <PlanForm
            starLesson={starLesson}
            removeStarLesson={removeStarLesson}
            state={selectedLesson}
            setState={setSelectedLesson}
            colorMapping={colorize(starLesson)}
          />
        </Route>
        <Route path='/:semester/classtable'>
          <ClassTableForm
            sjtuLesson={sjtuLesson}
            starLesson={starLesson}
            setStarLesson={setStarLesson}
            dataLoading={sjtuLessonLoading}
            syncFromISJTU={syncFromISJTU}
            colorMapping={colorize(sjtuLesson)}
          />
        </Route>
      </Switch>
    </div>
  )
}
