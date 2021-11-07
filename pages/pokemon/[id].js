import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/layout'
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import Image from 'next/image'

export default function FirstPost({ detailPokemon }) {
  return (
    <Layout>
    	<Head>
        <title>{detailPokemon.name}</title>
      </Head>

      <Link href="/">
        <a>Back to home</a>
      </Link>
      
      <h1>{detailPokemon.name}</h1>
      <div>
        <div>{`#${detailPokemon.id}`}</div>
        <ul>
          {detailPokemon.pokemons[0].types.map((data_type) => (
            <li key={data_type.type.name}>{data_type.type.name}</li>
          ))}
        </ul>
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${detailPokemon.id}.png`  }
          height={144}
          width={144}
          alt={detailPokemon.name}
        />
      </div>

      <div>
        <h2>About</h2>
        <div>{detailPokemon.description[0].flavor_text}</div>
        <div>Height: {detailPokemon.pokemons[0].height}</div>
        <div>Weight: {detailPokemon.pokemons[0].weight}</div>
        <div>
          Abilities: 
          {detailPokemon.pokemons[0].abilities.map((ability) => (
            <span key={ability.ability.name}>{ability.ability.name}, </span>
          ))}
        </div>
      </div>

      <div>
        <h2>Breeding</h2>
        <div>Gender: {detailPokemon.gender_rate}</div>
        <div>
          Egg Group: 
          {detailPokemon.egg_groups.map((egg_group) => (
            <span key={egg_group.group.name}>{egg_group.group.name}, </span>
          ))}
        </div>
        <div>Egg Cycles: {detailPokemon.hatch_counter}</div>
      </div>

      <div>
        <h2>Base stats</h2>
        
        {detailPokemon.pokemons[0].stats.map((stat) => (
          <div key={stat.stat.name}>{stat.stat.name} {stat.base_stat}, </div>
        ))}
     
        <div>Egg Cycles: {detailPokemon.hatch_counter}</div>
      </div>

      <div>
        <h2>Evolution</h2>
        
        {detailPokemon.evolutions.species.map((evolution) => (
          <div>
            <div key={evolution.id}> {evolution.name}, </div>
            { evolution.evolutions.length>0 && <div>Level {evolution.evolutions[0].min_level}+</div> }
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`}
              height={144}
              width={144}
              alt={evolution.name}
            />
          </div>
        ))}
     
      </div>


    </Layout>
  )
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query getPokemons {
      species: pokemon_v2_pokemonspecies(
        limit: 100
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

  const newData = data.species.map((data) => {
    return { params: { id: data.name } };
  });

  return {
    paths: newData,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { data } = await client.query({
    query: gql`
      query getPokemon {
        species: pokemon_v2_pokemonspecies(where: {name: { _eq: "${params.id}" }} limit: 1) {
          id
          gender_rate
          hatch_counter
          name
          description: pokemon_v2_pokemonspeciesflavortexts(limit: 1 where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
            flavor_text
          }
          evolutions: pokemon_v2_evolutionchain {
            species: pokemon_v2_pokemonspecies(order_by: {order: asc}) {
              id
              name
              evolves_from_species_id
              evolutions: pokemon_v2_pokemonevolutions {
                min_level
                min_affection
                min_beauty
                min_happiness
                gender_id
                time_of_day
                move: pokemon_v2_move {
                  name
                }
                by_held_item: pokemonV2ItemByHeldItemId {
                  name
                }
                item: pokemon_v2_item {
                  name
                }
                evolution_trigger: pokemon_v2_evolutiontrigger {
                  name
                }
                location: pokemon_v2_location {
                  name
                }
              }
            }
          }
          egg_groups: pokemon_v2_pokemonegggroups {
            group: pokemon_v2_egggroup {
              name
            }
          }
          pokemons: pokemon_v2_pokemons {
            id
            name
            height
            weight
            types: pokemon_v2_pokemontypes {
              type: pokemon_v2_type {
                name
              }
            }
            abilities: pokemon_v2_pokemonabilities {
              ability: pokemon_v2_ability {
                name
              }
            }
            stats: pokemon_v2_pokemonstats {
              base_stat
              stat: pokemon_v2_stat {
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
      detailPokemon: data.species[0],
    },
  };
}
