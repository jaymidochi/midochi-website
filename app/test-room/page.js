import DealRoom from '../../components/DealRoom'

export const metadata = {
  title: 'Acme Wellness × Midochi',
  robots: { index: false, follow: false },
}

export default function TestRoomPage() {
  return <DealRoom collection="test-room" />
}
