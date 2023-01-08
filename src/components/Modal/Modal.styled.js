import styled from '@emotion/styled';

export const Overlay = styled.div`
  position: fixed;
  z-index: 150;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

export const ModalWindow = styled.div`
  width: fit-content;
  max-width: 90vw;
  height: fit-content;
  max-height: 95vh;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  object-fit: contain;
  border-radius: 8px;
  overflow: hidden;
`;
