import { isEqual } from 'lodash'
import { FunctionComponent, useEffect } from 'react'
import { Provider } from 'react-redux'
import { initializeAuth } from './ocAuth'
import logout from './ocAuth/logout'
import { OcConfig, setConfig } from './ocConfig'
import { retrieveOrder } from './ocCurrentOrder'
import ocStore, { useOcDispatch, useOcSelector } from './ocStore'
import { getUser } from './ocUser'
import { listProducts } from './ocProductCache'

interface OcProviderProps {
  config: OcConfig
}

const OcInitializer: FunctionComponent<OcProviderProps> = ({ children, config }) => {
  const dispatch = useOcDispatch()
  const { ocConfig, ocAuth, ocUser, ocCurrentOrder, OcProductList, OcProductCache } = useOcSelector(
    (s) => ({
      ocConfig: s.ocConfig,
      ocAuth: s.ocAuth,
      ocUser: s.ocUser,
      ocCurrentOrder: s.ocCurrentOrder,
      OcProductList: s.ocProductList,
      OcProductCache: s.ocProductCache,
    })
  )

  useEffect(() => {
    if (!ocConfig.value || !isEqual(ocConfig.value, config)) {
      dispatch(setConfig(config))
    } else if (!ocAuth.initialized) {
      dispatch(initializeAuth())
    } else if (
      (ocAuth.isAnonymous && !ocAuth.isAuthenticated) ||
      (ocAuth.isAuthenticated && config.clientId.toLowerCase() !== ocAuth.decodedToken.cid)
    ) {
      dispatch(logout())
    } else if (ocAuth.isAuthenticated) {
      if (!ocUser.user && !ocUser.loading) {
        dispatch(getUser())
      }
      if (!ocCurrentOrder.initialized) {
        dispatch(retrieveOrder())
      }
      if (!OcProductList.items && OcProductCache?.ids?.length < 1) {
        dispatch(listProducts({ catalogID: 'Chetak_Catalog' }))
      }
    }
  }, [dispatch, config, ocConfig, ocAuth, ocUser, ocCurrentOrder, OcProductList, OcProductCache])

  return <>{children}</>
}

const OcProvider: FunctionComponent<OcProviderProps> = ({ children, config }) => {
  return (
    <Provider store={ocStore}>
      <OcInitializer config={config}>{children}</OcInitializer>
    </Provider>
  )
}

export default OcProvider
