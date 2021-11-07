import Head from 'next/head'
import Content from "./Content";
import { gql } from "@apollo/client";
import client from "../apollo-client";
import Layout, { siteTitle } from '../components/layout'
import styles from '../styles/homepage.module.css'
import Image from 'next/image'

export default function Home({ listPokemon }) {
  return (
    <Layout>
      <Head>
        <title>Pokemon Card</title>
      </Head>
      <section className="container">
        <h1 className={styles.title}>
          <Image
            src={ `/favicon.png` }
            height={40}
            width={40}
          />
          <span>Pokemon Card</span>
        </h1>
        <div className="p-2">
          <Content data={listPokemon} />
        </div>
      </section>
    </Layout>
  );
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