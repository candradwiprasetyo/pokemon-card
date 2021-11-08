import React, { useState } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { gql } from "@apollo/client";
import client from "../apollo-client";
import styles from '../styles/style.module.css'
import classnames from 'classnames';
import Image from 'next/image'

const Content = ({ data }) => {
  const [posts, setPosts] = useState(data);
  const [hasMore, setHasMore] = useState(true);

  const getMorePost = async () => {
    const { data } = await client.query({
      query: gql`
        query getPokemons {
        species: pokemon_v2_pokemonspecies(
          limit: 10
          offset: ${posts.length}
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
    const newPosts = data.species;
    setPosts((post) => [...post, ...newPosts]);
  };

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePost}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        <ul className={styles.grid}>
          {posts.map((data, index) => (
            <li className={styles['grid-item']} key={data.id}>
              <Link href={`/pokemon/${data.name}`}>
                <a>
                  <article className={classnames(
                    styles['pokemon-box'], 
                    (data.pokemons[0].types[0].type.name == 'ground') ? styles['bg-type-1'] : '',
                    (data.pokemons[0].types[0].type.name == 'grass') ? styles['bg-type-2'] : '',
                    (data.pokemons[0].types[0].type.name == 'poison') ? styles['bg-type-3'] : '',
                    (data.pokemons[0].types[0].type.name == 'fire') ? styles['bg-type-4'] : '',
                    (data.pokemons[0].types[0].type.name == 'water') ? styles['bg-type-5'] : '',
                    (data.pokemons[0].types[0].type.name == 'flying') ? styles['bg-type-6'] : ''
                  )}>
                    <div className={styles['pokemon-box-background']}
                      style={{backgroundImage: "url(" + `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png` + ")"}}
                    />
                    <div className={styles['pokemon-box-title']}>{data.name}</div>
                    <div className={styles['pokemon-box-number']}>#{data.id}</div>
                    <figure className={styles['pokemon-box__types']}>
                      <ul className={styles['pokemon-types']}>
                        {data.pokemons[0].types.map((data_type) => (
                          <li className={styles['pokemon-type']} key={data_type.type.name}>
                            <div className={styles['pokemon-type-background']} />
                            {data_type.type.name}
                          </li>
                        ))}
                      </ul>
                    </figure>
                    <div className={styles['pokemon-box-frame']}>
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`  }
                        height={144}
                        width={144}
                        alt={data.name}
                        className={styles['pokemon-box-img']}
                      />
                    </div>
                  </article>
                </a>
              </Link>
            </li> 
          ))}
        </ul>
      </InfiniteScroll>
      <style jsx>
        {`
          .back {
            padding: 10px;
            background-color: dodgerblue;
            color: white;
            margin: 10px;
          }
        `}
      </style>
    </>
  );
};

export default Content;
