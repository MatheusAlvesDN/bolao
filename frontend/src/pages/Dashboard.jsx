import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import Spinner from '../components/Spinner'
import {reset} from '../features/auth/authSlice'
import {getJogos} from '../features/jogos/jogosSlice'
import { getPalpites } from '../features/palpites/palpiteSlice'
import PalpiteItem from '../components/PalpiteItem'
import { useState } from 'react'
import ReactCountryFlag from 'react-country-flag'


function Dashboard() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user} = useSelector((state) => state.auth)
  const {jogos, isLoading, isError, message} = useSelector((state) => state.jogos)
  const {palpites, isLoadingP, isErrorP, messageP} = useSelector((state) => state.palpites)
  useEffect(() => {
    if(isError) {
      console.log(message)
    }

    if(!user) {
      navigate('/login')
    } else {
      dispatch(getJogos())
      dispatch(getPalpites())
    }

    return () => {
      dispatch(reset())
    }
    
  }, [user, navigate, isError, message, dispatch])


  if(isLoading && isLoadingP) {
    return <Spinner/>
  } 

  return (
    <>
      <section>
        <h1>Bem-vindo, {user && user.name}</h1>
        <br/>
        <h2>Jogos</h2>
        <h3>Você pode palpitar até 30 minutos antes do início do jogo!</h3>
      </section>
      <div className='palpitesgrid'>
        <section className='contentpalpites'>
          {jogos?.length > 0 ? 
          (<div className='palpites'>
              {jogos?.map((jogo) =>(
                <PalpiteItem key={jogo._id} jogo={jogo} />
              ))}
          </div>
            ) : 
          (<h3>Não há jogos cadastrados</h3>)}
        </section>
        <section className='contentpalpites'>
          <h2>Seus palpites</h2>
          {palpites?.length > 0 ? 
          (<div className='palpite'>
              {palpites?.map((palpite) =>(
                <>{palpite.jogo.infoJogo}
                <div className='times'>
                  <div className='time1'>
                  <ReactCountryFlag countryCode={palpite.jogo.isocodetime1} svg style={{
                    width: '2em',
                    height: '2em',
                  }}/>
                  <h2>{palpite.jogo.time1}</h2>
                  <h2>{palpite.palpite1}</h2>
                  </div>
                  <h2>x</h2>
                  <div className='time2'>
                    <h2>{palpite.palpite2}</h2>
                    <h2>{palpite.jogo.time2}</h2>
                    <ReactCountryFlag countryCode={palpite.jogo.isocodetime2} svg style={{
                      width: '2em',
                      height: '2em',
                    }}/>
                  </div>
                </div>
                </>
              ))}
          </div>
            ) : 
          (<h3>Você ainda não fez palpites.</h3>)}
        </section>
      </div>         

    </>
  )
}

export default Dashboard