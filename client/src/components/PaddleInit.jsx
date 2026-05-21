import { useEffect } from 'react';
import { initPaddle } from '../lib/paddle';

export default function PaddleInit() {
  useEffect(() => {
    initPaddle();
  }, []);
  return null;
}
