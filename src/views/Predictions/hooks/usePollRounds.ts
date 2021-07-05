import { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useGetCurrentEpoch, useGetPredictionsStatus } from 'state/hooks'
import { fetchRounds } from 'state/predictions'
import { PredictionStatus } from 'state/types'

const POLL_TIME_IN_SECONDS = 10

const usePollRounds = () => {
  const timer = useRef<NodeJS.Timeout>(null)
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const currentEpoch = useGetCurrentEpoch()
  const status = useGetPredictionsStatus()

  useEffect(() => {
    // Clear old timer
    if (timer.current) {
      clearInterval(timer.current)
    }

    if (status === PredictionStatus.LIVE) {
      timer.current = setInterval(async () => {
        const liveAndCurrent = [currentEpoch, currentEpoch - 1]
        dispatch(fetchRounds(liveAndCurrent))
      }, POLL_TIME_IN_SECONDS * 1000)
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [timer, account, status, currentEpoch, dispatch])
}

export default usePollRounds