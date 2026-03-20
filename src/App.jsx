import './App.scss'

import axios from 'axios'
import chroma from 'chroma-js'
import { groupBy } from 'lodash'
import forEach from 'lodash/forEach'
import sortedBy from 'lodash/sortBy'
import React, { useReducer, useState } from 'react'
import GitHubButton from 'react-github-btn'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import ClassTable from './ClassTable'
import LessonList from './LessonList'
import LoginModal from './LoginModal'
import MobileDrawer from './MobileDrawer'
import MobileTopBar from './MobileTopBar'
import Navbar from './Navbar'
import Toolbar from './Toolbar'
import { ToolbarContext } from './ToolbarContext'
import { useLocalStorageSet } from './Utils'

function App() {
  const [filterFormState, setFilterFormState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      checkedNj: new Set(),
      checkedLx: new Set(),
      checkedYx: new Set(),
      checkedTy: new Set(),
      scheduleKey: '',
      lecturerKey: '',
      placeKey: '',
      keywordType: 'kcmc',
      keyword: '',
      composition: '',
      notes: '',
    }
  )

  const [starLesson, setStarLesson] = useLocalStorageSet(
    'starLesson',
    new Set([])
  )
  const [selectedLesson, setSelectedLesson] = useLocalStorageSet(
    'selectedLesson',
    new Set([])
  )
  const [sjtuLesson, setSjtuLesson] = useLocalStorageSet(
    'sjtuLesson',
    new Set([])
  )
  const [sjtuLessonLoading, setSjtuLessonLoading] = useState(false)

  const [loginDialog, setLoginDialog] = useState(false)
  const [showMobileDrawer, setShowMobileDrawer] = useState(false)

  const removeStarLesson = (value) => {
    const set = new Set(starLesson)
    set.delete(value)
    setStarLesson(set)
    const set2 = new Set(selectedLesson)
    set2.delete(value)
    setSelectedLesson(set2)
  }

  const syncFromISJTU = (semester) => {
    setSjtuLessonLoading(true)
    axios
      .get(`/api/course/lesson?term=${semester.replace('_', '-')}`)
      .then((resp) => {
        if (resp?.data?.error === 'success') {
          setSjtuLesson(new Set(resp.data.entities.map((x) => x.code)))
          setSjtuLessonLoading(false)
        } else {
          setSjtuLessonLoading(false)
          setLoginDialog(true)
        }
      })
      .catch((e) => {
        setLoginDialog(true)
        setSjtuLessonLoading(false)
      })
  }

  const handleLogin = (result) => {
    if (result) {
      window.location.href = '/login?app=course_plus'
    }
    setLoginDialog(false)
  }

  const colorize = (starLesson) => {
    const colorScale = chroma.scale('Spectral').gamma(0.5)
    // const colorScale = chroma.scale(['yellow', 'navy']).mode('lch');
    const starLessonArray = [...starLesson]
    const result = {}
    forEach(
      groupBy(starLessonArray, (lesson) =>
        lesson.split('-').slice(0, 3).join('-')
      ),
      (v) => {
        const colors = colorScale.colors(v.length)
        sortedBy(v).forEach((val, idx) => (result[val] = colors[idx]))
      }
    )
    return result
  }

  const toolbarValue = {
    filterFormState,
    setFilterFormState,
    starLesson,
    setStarLesson,
    selectedLesson,
    setSelectedLesson,
    sjtuLesson,
    setSjtuLesson,
    sjtuLessonLoading,
    syncFromISJTU,
    removeStarLesson,
    colorize,
  }

  return (
    <Router>
      <LoginModal show={loginDialog} nextStep={handleLogin}></LoginModal>

      <div className='container-fluid h-100'>
        <div className='row h-100'>
          <div className='col-md-3 d-none d-md-block h-100 bg-light overflow-auto'>
            <ToolbarContext.Provider value={toolbarValue}>
              <MobileDrawer
                showMobileDrawer={showMobileDrawer}
                setShowMobileDrawer={setShowMobileDrawer}
              />
              <Switch>
                <Route exact path='/'>
                  <Navbar />
                </Route>
                <Route path='/:semester'>
                  <Navbar />
                </Route>
              </Switch>

              <Toolbar />
            </ToolbarContext.Provider>

            <div className='container'>
              <p className='text-muted my-3 small'>
                免责声明：本网站课程相关数据来自上海交通大学教学信息服务网。具体开课情况以教务网为准。
              </p>
              <p className='text-muted my-3 small'>
                隐私政策：访问本网站，即代表您同意本网站使用“站长统计”收集您的访问信息。根据相关法律法规，本站不对欧盟用户提供服务。
              </p>
              <div className='row'>
                <div className='col d-flex d-row align-items-center'>
                  <p className='text-muted my-1 small'>
                    <a href='https://github.com/SJTU-Geek/course-plus'>
                      本项目
                    </a>{' '}
                    由{' '}
                    <a
                      href='https://geek.sjtu.edu.cn/'
                      target='_blank'
                      rel='noreferrer'
                    >
                      思源极客协会
                    </a>
                    维护。
                  </p>
                </div>
              </div>
              <div className='row justify-content-end'>
                <div className='col-auto my-2 p-0 d-flex d-row align-items-center'>
                  <GitHubButton
                    href='https://github.com/SJTU-Geek/course-plus'
                    data-show-count
                    data-size='large'
                  >
                    Star
                  </GitHubButton>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-9 h-100 classtable-wrapper'>
            <MobileTopBar setShowMobileDrawer={setShowMobileDrawer} />
            <div className='classtable-frame w-100'>
              <Switch>
                <Route path='/:semester/browse'>
                  <LessonList
                    filterData={filterFormState}
                    state={starLesson}
                    setState={setStarLesson}
                  />
                </Route>
                <Route path='/:semester/plan'>
                  <ClassTable
                    selectedLesson={selectedLesson}
                    colorMapping={colorize(starLesson)}
                  />
                </Route>
                <Route path='/:semester/classtable'>
                  <ClassTable
                    selectedLesson={sjtuLesson}
                    colorMapping={colorize(sjtuLesson)}
                  />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
