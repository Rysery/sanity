/* eslint-disable react/no-multi-comp */
import React, {useState, useRef, useEffect} from 'react'
import styles from './PopoverList.css'
import ListItem from './ListItem'
import {User, Size} from './types'
import {Tooltip} from 'react-tippy'
import CogIcon from 'part:@sanity/base/cog-icon'
import {useId} from '@reach/auto-id'

type Props = {
  userList: User[]
  avatarSize?: Size
  position?: 'top' | 'bottom'
  trigger?: 'mouseenter' | 'click' | 'manual'
  children?: any
  distance?: number
  disabled?: boolean
  isGlobal?: boolean
  projectId?: string
}

export default function PopoverList({
  userList = [],
  position = 'top',
  distance = 10,
  avatarSize,
  trigger,
  children,
  disabled = false,
  isGlobal = false,
  projectId
}: Props) {
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const elementId = useId()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleMenu = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsOpen(!isOpen)
    }
  }

  const handleFocus = () => {
    if (menuRef.current) {
      return menuRef.current.focus()
    }
  }

  const handleResetFocus = event => {
    if (buttonRef.current) {
      buttonRef.current.focus()
    }
  }

  const html = (
    <div
      className={styles.inner}
      role="menu"
      id={elementId}
      aria-label="Online collaborators"
      ref={menuRef}
      tabIndex={-1}
    >
      {isGlobal && userList.length < 1 && (
        <div className={styles.header}>
          <h2 className={styles.title}>No one's here!</h2>
          <p className={styles.subtitle}>Invite more collaborators to see their online statuses.</p>
        </div>
      )}
      {userList.length > 0 && (
        <ul className={styles.userList}>
          {userList.map(user => (
            <li key={user.sessionId}>
              <ListItem
                id={user.identity}
                status={user.status}
                sessions={user?.sessions}
                size={avatarSize}
              />
            </li>
          ))}
        </ul>
      )}
      {isGlobal && projectId && (
        <div className={styles.manageMembers}>
          <a
            href={`https://manage.sanity.io/projects/${projectId}/team`}
            className={styles.manageLink}
            target="_blank"
            rel="noopener noreferrer"
            onBlur={handleResetFocus}
          >
            <span>Manage members</span>
            <CogIcon />
          </a>
        </div>
      )}
    </div>
  )
  return (
    <div className={styles.root}>
      <Tooltip
        useContext
        html={html}
        disabled={disabled}
        interactive
        position={position}
        trigger={trigger}
        arrow
        theme="light"
        distance={distance}
        className={styles.tooltip}
      >
        <button
          aria-label={isOpen ? 'Close collaborator menu' : 'Open collaborator menu'}
          type="button"
          className={styles.button}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-controls={elementId}
          onKeyDown={handleToggleMenu}
          ref={buttonRef}
          style={isGlobal ? {height: '100%'} : {}}
        >
          {children}
        </button>
      </Tooltip>
    </div>
  )
}