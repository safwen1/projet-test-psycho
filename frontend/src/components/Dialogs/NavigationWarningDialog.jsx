import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';

const WarningIcon = styled(Warning)`
  color: #f39c12;
  font-size: 48px !important;
  margin-bottom: 16px;
`;

const DialogContainer = styled(Dialog)`
  .MuiPaper-root {
    border-radius: 12px;
    padding: 8px;
    max-width: 500px;
  }
`;

const DialogHeader = styled(DialogTitle)`
  text-align: center;
  font-family: "Kanit", sans-serif !important;
  font-weight: 600 !important;
  color: #e74c3c;
  padding-top: 24px;
`;

const DialogBody = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  text-align: center;
`;

const Message = styled(Typography)`
  margin-bottom: 16px;
  font-size: 16px !important;
  line-height: 1.6 !important;
`;

const ButtonsContainer = styled(DialogActions)`
  padding: 16px 24px 24px;
  justify-content: center;
  gap: 16px;
`;

const CancelButton = styled(Button)`
  background-color: #f0f0f0 !important;
  color: #333 !important;
  font-weight: 600 !important;
  padding: 8px 24px !important;
  border-radius: 8px !important;
  
  &:hover {
    background-color: #e0e0e0 !important;
  }
`;

const ContinueButton = styled(Button)`
  background: linear-gradient(135deg, #ff9800 0%, #fb8c00 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 8px 24px !important;
  border-radius: 8px !important;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3) !important;
  }
`;

/**
 * Composant de dialogue d'avertissement pour les tentatives de navigation pendant un test
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.open - État d'ouverture du dialogue
 * @param {Function} props.onConfirm - Fonction appelée pour confirmer la navigation (quitter)
 * @param {Function} props.onCancel - Fonction appelée pour annuler la navigation (rester)
 * @param {string} props.title - Titre du dialogue
 * @param {string} props.message - Message d'avertissement
 * @returns {JSX.Element} - Composant de dialogue d'avertissement
 */
const NavigationWarningDialog = ({
  open,
  onConfirm,
  onCancel,
  title = "Attention !",
  message = "Si vous quittez cette page, votre progression dans le test sera perdue. Êtes-vous sûr de vouloir continuer ?",
}) => {
  return (
    <DialogContainer
      open={open}
      onClose={onCancel}
      aria-labelledby="navigation-warning-dialog-title"
    >
      <DialogHeader id="navigation-warning-dialog-title">
        {title}
      </DialogHeader>
      <DialogBody>
        <WarningIcon />
        <Message variant="body1">
          {message}
        </Message>
      </DialogBody>
      <ButtonsContainer>
        <ContinueButton onClick={onCancel} autoFocus>
          Continuer le test
        </ContinueButton>
        <CancelButton onClick={onConfirm}>
          Quitter quand même
        </CancelButton>
      </ButtonsContainer>
    </DialogContainer>
  );
};

export default NavigationWarningDialog; 