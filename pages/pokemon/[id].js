import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/layout'
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import Image from 'next/image'
import styles from '../../styles/style.module.css'
import classnames from 'classnames';

const barStats = (value) => {
  let result = value / 200 * 100;
  return result;
};

const getHeight = (value) => {
  value = value * 10;
  let height = value / 100;
  let inches = (value*0.393700787).toFixed(0);
  let feet = Math.floor(inches / 12);
  inches %= 12;
  return feet + "'" + inches + '"' + ' (' + height + ' m)';
};

const getWeight = (value) => {
  let kg = value / 10;
  let lbs = (kg * 2.2046).toFixed(1);
  return lbs + " lbs"  + ' (' + kg + ' kg)';
};

const getGender = (value) => {
  let female = value / 8 * 100;
  let male = (8 - value) / 8 * 100;
  return '♂ ' + male + '%' + ' ♀ ' + female + '%';
};

export default function DetailPage({ detailPokemon }) {
  return (
    <Layout>
    	<Head>
        <title>{detailPokemon.name}</title>
      </Head>

      <section className="container">
        <div 
          className={classnames(
          styles['detail-banner'],
          (detailPokemon.pokemons[0].types[0].type.name == 'ground') ? styles['bg-type-1'] : '',
          (detailPokemon.pokemons[0].types[0].type.name == 'grass') ? styles['bg-type-2'] : '',
          (detailPokemon.pokemons[0].types[0].type.name == 'poison') ? styles['bg-type-3'] : '',
          (detailPokemon.pokemons[0].types[0].type.name == 'fire') ? styles['bg-type-4'] : '',
          (detailPokemon.pokemons[0].types[0].type.name == 'water') ? styles['bg-type-5'] : '',
          (detailPokemon.pokemons[0].types[0].type.name == 'flying') ? styles['bg-type-6'] : ''
        )}>
          <div className={styles['detail-banner-background']}
            style={{backgroundImage: "url(" + `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${detailPokemon.id}.png` + ")"}}
          />
          <Link href="/">
            <a>
              <Image
                src={`/images/back-button.png` }
                height={24}
                width={24}
              />
            </a>
          </Link>
          <div>
            <div className={styles['detail-title']}>
              <h1>{detailPokemon.name}</h1>
            </div>
            <div className={styles['detail-number']}>#{detailPokemon.id}</div>
          </div>
          <div>
            <div className={styles['detail-pokemon-types']}>
              {detailPokemon.pokemons[0].types.map((data_type) => (
                <span className={styles['detail-pokemon-type']} key={data_type.type.name}>
                  {data_type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className={styles['detail-image']}>
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${detailPokemon.id}.png`  }
              height={200}
              width={200}
              alt={detailPokemon.name}
            />
          </div>
        </div>

        <div className={styles['detail-content']}>
          <h2 className={styles['detail-content-title']}>About</h2>
          <div>{detailPokemon.description[0].flavor_text}</div>
          <br />
          <div className={styles['detail-list']}>
            <div className={styles['detail-list-label']}>Height</div>
            <div className={styles['detail-list-value']}>{getHeight(detailPokemon.pokemons[0].height)}</div>
            <div className={styles['detail-list-label']}>Weight</div>
            <div className={styles['detail-list-value']}>{getWeight(detailPokemon.pokemons[0].weight)}</div>
            <div className={styles['detail-list-label']}>Abilities</div>
            <div className={styles['detail-list-value']}>
              {detailPokemon.pokemons[0].abilities.map((ability, index) => (
                <span key={ability.ability.name}>{(index!=0) ? ', ' : ''}{ability.ability.name}</span>
              ))}
            </div>
          </div>

          <div>
            <h2 className={styles['detail-content-title']}>Breeding</h2>
            <div className={styles['detail-list']}>
              <div className={styles['detail-list-label']}>Gender</div>
              <div className={styles['detail-list-value']}>{getGender(detailPokemon.gender_rate)}</div>
              <div className={styles['detail-list-label']}>Egg Group</div>
              <div className={styles['detail-list-value']}>
                {detailPokemon.egg_groups.map((egg_group, index) => (
                  <span key={egg_group.group.name}>{(index!=0) ? ', ' : ''}{egg_group.group.name}</span>
                ))}
              </div>
              <div className={styles['detail-list-label']}>Egg Cycles</div>
              <div className={styles['detail-list-value']}>{detailPokemon.hatch_counter}</div>
            </div>
          </div>

          <div>
            <h2 className={styles['detail-content-title']}>Base stats</h2>
            {detailPokemon.pokemons[0].stats.map((stat) => (
              <div key={stat.stat.name}>
                <div  className={styles['detail-list']}>
                  <div className={styles['detail-list-label']}>{stat.stat.name}</div>
                  <div className={classnames(styles['detail-list-value'], "text-right")}>{stat.base_stat}</div>
                  <div></div>
                </div>
                <div className={styles['detail-bar']}>
                  <div className={styles['detail-bar-value']}
                    style={{width: barStats(stat.base_stat) + '%' }}
                  >
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className={styles['detail-content-title']}>Evolution</h2>
            {detailPokemon.evolutions.species.map((evolution) => (
              <div key={evolution.id}>
                <div > {evolution.name}, </div>
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
        </div>
      </section>
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
