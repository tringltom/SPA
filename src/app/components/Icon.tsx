import React, { MouseEventHandler } from 'react'

import { faEyeSlash, faEye, faEnvelope, faLock, faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ICON_MAPS: Record<string, IconDefinition> = {
  'eyeSlash': faEyeSlash,
  'eye': faEye,
  'envelope': faEnvelope,
  'password': faLock,
  'facebook': faFacebook,
  'instagram': faInstagram,
  'user': faUser
}

interface IconProps extends React.SVGProps<SVGSVGElement> {    
    iconName: string;
    className?: string;
    onClick?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
}

const Icon = (props: IconProps) => {

    const {iconName, className, onClick, onMouseEnter, onMouseLeave} = props;

  return (
    <FontAwesomeIcon className={className} icon={ICON_MAPS[iconName]} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
  )
}

export default Icon