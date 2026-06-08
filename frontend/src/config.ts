// 배포 시 Render에서 제공할 주소를 VITE_API_URL에 넣으면 됩니다.
// 로컬 환경에서는 기본적으로 3001 포트를 사용합니다.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
