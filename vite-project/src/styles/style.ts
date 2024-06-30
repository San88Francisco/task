import styled from 'styled-components';

export const TableContainer = styled.div`
  height: 530px;
  border-radius: 20px;
  border-top: 20px solid #c1e2a4;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  font-family: 'Roboto';
  color: #1C2621;
  padding: 15px;
  margin: 40px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TableButton = styled.button`
  padding: 10px;
  margin: 2px 5px;
  border-radius: 15px;
  cursor: pointer;
  border: none;
  box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px;
  transition: all 0.1s ease;
  
  &:hover {
    background-color: #fdfdfd;
  }
`;

export const BoxContainer = styled.div`
  width: 475px;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  font-family: 'Roboto';
  border-top: 20px solid #c1e2a4;
  margin: 10px;
`;

export const StyledButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 17px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  
  &:hover {
    background-color: #fdfdfd;
  }
`;
