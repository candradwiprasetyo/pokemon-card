import Head from 'next/head'
import Link from "next/link";
import Layout, { siteTitle } from '../components/layout'
import styles from '../styles/homepage.module.css'
import { gql } from "@apollo/client";
import client from "../apollo-client";
import classnames from 'classnames';
import Image from 'next/image'

export default function Home({ listPokemon }) {
  return (
    <Layout>
      <Head>
        <title>Pokemon Card</title>
      </Head>
      <section className={styles.container}>
        <h1>Pokemon Card</h1>
        <div className="p-2">
          <div className={styles.grid}>
            {listPokemon.map((data) => (
              <li className={styles['grid-item']} key={data.id}>
                <Link href={`/pokemon/${data.name}`}>
                  <a>
                    <article className={classnames(styles['pokemon-box'], styles['bg-light'])}>
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`  }
                        height={144}
                        width={144}
                        alt={data.name}
                      />
                      <span>#{data.id}</span>
                      <span>{data.name}</span>
                      <figure className={styles['pokemon-box__types']}>
                        <ul className={styles['pokemon-types']}>
                          {data.pokemons[0].types.map((data_type) => (
                            <li className={styles['pokemon-type']} key={data_type.type.name}>{data_type.type.name}</li>
                          ))}
                        </ul>
                      </figure>
                    </article>
                  </a>
                </Link>
              </li>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query getPokemons {
      species: pokemon_v2_pokemonspecies(
        limit: 10
        offset: 0
        order_by: {id: asc}
        ) {
        id
        name
        pokemons: pokemon_v2_pokemons {
          id
          types: pokemon_v2_pokemontypes {
            type: pokemon_v2_type {
              name
            }
          }
        }
      }
      species_aggregate: pokemon_v2_pokemonspecies_aggregate {
        aggregate {
          count
        }
      }
    }
    `,
  });

  return {
    props: {
      listPokemon: data.species,
    },
  };
}