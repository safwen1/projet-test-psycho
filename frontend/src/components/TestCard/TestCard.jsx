import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CardWrapper = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: ${props => (props.$comingSoon || props.$disabled) ? 'default' : 'pointer'};
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: ${props => (props.$comingSoon || props.$disabled) ? 0.8 : 1};

  &:hover {
    transform: ${props => (props.$comingSoon || props.$disabled) ? 'none' : 'translateY(-5px)'};
    box-shadow: ${props => (props.$comingSoon || props.$disabled) ? '0 10px 20px rgba(0, 0, 0, 0.05)' : '0 15px 30px rgba(0, 0, 0, 0.1)'};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${props => props.color || '#fabc1c'};
    opacity: ${props => (props.$comingSoon || props.$disabled) ? 0.5 : 1};
  }
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: 25px;
  right: -50px;
  background: #f44336;
  color: white;
  padding: 8px 60px;
  transform: rotate(45deg);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
  text-align: center;
  width: 200px;
  letter-spacing: 0.5px;
`;

const DisabledBadge = styled.div`
  position: absolute;
  top: 25px;
  right: -50px;
  background: #757575;
  color: white;
  padding: 8px 60px;
  transform: rotate(45deg);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
  text-align: center;
  width: 200px;
  letter-spacing: 0.5px;
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => `${props.color}15` || '#fabc1c15'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #888;
  font-size: 0.9rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Button = styled.button`
  background: ${props => props.color || '#fabc1c'};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => (props.$comingSoon || props.$disabled) ? 'not-allowed' : 'pointer'};
  transition: opacity 0.3s ease;
  width: 100%;
  opacity: ${props => (props.$comingSoon || props.$disabled) ? 0.7 : 1};

  &:hover {
    opacity: ${props => (props.$comingSoon || props.$disabled) ? 0.7 : 0.9};
  }
`;

const TestCard = ({
  title,
  description,
  duration,
  questionCount,
  icon: Icon,
  accentColor,
  onStart,
  comingSoon,
  disabled
}) => {
  return (
    <CardWrapper color={accentColor} $comingSoon={comingSoon} $disabled={disabled}>
      {comingSoon && <ComingSoonBadge>Bientôt disponible</ComingSoonBadge>}
      {disabled && !comingSoon && <DisabledBadge>Identification requise</DisabledBadge>}
      <div>
        <IconWrapper color={accentColor}>
          <Icon size={30} color={accentColor} />
        </IconWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </div>
      
      <div>
        <MetaInfo>
          <span>⏱️ {duration}</span>
          <span>📝 {questionCount} questions</span>
        </MetaInfo>
        <Button 
          color={accentColor}
          onClick={onStart}
          $comingSoon={comingSoon}
          $disabled={disabled}
          disabled={comingSoon || disabled}
        >
          {comingSoon ? 'Bientôt disponible' : disabled ? 'Identification requise' : 'Commencer le test'}
        </Button>
      </div>
    </CardWrapper>
  );
};

TestCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  questionCount: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  accentColor: PropTypes.string,
  onStart: PropTypes.func.isRequired,
  comingSoon: PropTypes.bool,
  disabled: PropTypes.bool
};

TestCard.defaultProps = {
  comingSoon: false,
  disabled: false
};

export default TestCard; 