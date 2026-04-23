const fs = require('fs');
const { execFileSync } = require('child_process');

const { getClientRemoteConfig } = require('./clientGeneratedEnv');

const clientRemoteConfig = getClientRemoteConfig();

const data = [
  {
    "nazwa_kategorii": "Pieczywo",
    "opis_kategorii": "Wszystkie nasze potrawy są przygotowywane z najlepszej jakości produktów, bez użycia ulepszaczy smaku, konserwantów i barwników.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Chleb własnego wypieku na zakwasie z mąki żytniej i piwie pszenicznym",
        "gramatura": "0,5 kg - 1 szt.",
        "cena": 29,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Chleb własnego wypieku na zakwasie z mąki żytniej i piwie pszenicznym",
        "gramatura": "1 kg - 1 szt.",
        "cena": 39,
        "vegan": true,
        "vegetarian": true
      }
    ]
  },
  {
    "nazwa_kategorii": "Zupy",
    "opis_kategorii": "Wszystkie nasze potrawy są przygotowywane z najlepszej jakości produktów, bez użycia ulepszaczy smaku, konserwantów i barwników.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Rosół z kury domowej gotowany 12 godzin na wolnym ogniu, z ekologiczną marchewką, świeżo ciętym lubczykiem i natką młodej pietruszki",
        "gramatura": "0,9 l",
        "cena": 68,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Barszcz bardzo czerwony gotowany z suszonymi borowikami i kwaśnymi jabłkami, pełen czosnku i świeżego majeranku",
        "gramatura": "0,9 l",
        "cena": 78,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Domowy żurek na 5-ciodniowym zakwasie z mąki żytniej razowej gotowany na wędzonych żeberkach, z białą surową kiełbasą, pełen czosnku i świeżo tartego chrzanu",
        "gramatura": "0,9 l",
        "cena": 79,
        "vegan": false,
        "vegetarian": false
      }
    ]
  },
  {
    "nazwa_kategorii": "Przystawki",
    "opis_kategorii": "Wszystkie nasze potrawy są przygotowywane z najlepszej jakości produktów, bez użycia ulepszaczy smaku, konserwantów i barwników.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Jajo wiejskie dekorowane świeżą wielkanocną rzeżuchą i kiełkami amarantusa z farszem ze świeżą rzodkiewką, majonezem, rzeżuchą i korniszonami",
        "gramatura": "2 połówki - 1 szt.",
        "cena": 13,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Jajo wiejskie dekorowane świeżą wielkanocną rzeżuchą i kiełkami amarantusa z farszem z polnymi brązowymi pieczarkami, majonezem, wiejskim masłem, grubym szczypiorem z młodej dymki i świeżą rzodkiewką",
        "gramatura": "2 połówki - 1 szt.",
        "cena": 16,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Jajo wiejskie dekorowane świeżą wielkanocną rzeżuchą i kiełkami amarantusa z farszem z wędzonym łososiem bałtyckim, creme fraiche, świeżo tartym chrzanem i młodym szczypiorkiem",
        "gramatura": "2 połówki - 1 szt.",
        "cena": 19,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Tradycyjna sałatka Wielkanocna z ekologicznych warzyw korzennych, ze świeżym jabłkiem Grójeckim, wiejskimi jajami od kur zielononóżek i świeżą natką pietruszki",
        "gramatura": "100 g",
        "cena": 16,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Biała surowa kiełbasa z czosnkiem niedźwiedzim pieczona w piwie pszenicznym z Miłosławia z miodem gryczanym, ziarnami gorczycy, musztardą i świeżym majerankiem",
        "gramatura": "ok. 200 g - 1 szt.",
        "cena": 19,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Śledź bałtycki w kwaśnej wiejskiej śmietanie z kwaśną Renetą i szalotką bananową",
        "gramatura": "100 g",
        "cena": 18,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Schab Złotnicki wolno gotowany w niskiej temperaturze, marynowany w ziołach prowansalskich i faszerowany suszoną śliwką sechlońską, podany w galarecie",
        "gramatura": "100 g",
        "cena": 27,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Pierś z indyka wolno gotowana w niskiej temperaturze, marynowana w ziołach prowansalskich i faszerowana suszonymi morelami, podana w galarecie",
        "gramatura": "100 g",
        "cena": 28,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Pasztet wegetariański z soczewicą i orzechami włoskimi",
        "gramatura": "100 g",
        "cena": 26,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Staropolski pasztet z jelenia pełen świeżych ziół i owoców runa leśnego",
        "gramatura": "100 g",
        "cena": 29,
        "vegan": false,
        "vegetarian": false
      }
    ]
  },
  {
    "nazwa_kategorii": "Świąteczny obiad",
    "opis_kategorii": "Wszystkie nasze potrawy są przygotowywane z najlepszej jakości produktów, bez użycia ulepszaczy smaku, konserwantów i barwników.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Devolay z piersi kurczaka zagrodowego pełen wiejskiego masła i młodej naci ekologicznej pietruszki",
        "gramatura": "1 szt.",
        "cena": 48,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Konfitowana nóżka z kaczki leniwie pieczona w gęsim tłuszczu",
        "gramatura": "1 szt.",
        "cena": 52,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Domowe zrazy wołowe słusznej wielkości, z czosnkowym ogórkiem kiszonym, razowym chlebem wiejskim i wędzonym boczkiem",
        "gramatura": "1 szt.",
        "cena": 54,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Kaczka w swej całej krasie, nacierana świeżym majerankiem i wolniutko pieczona we własnym tłuszczu z kwaśnymi jabłkami odmiany Reneta",
        "gramatura": "1/2 kaczki - 1 szt.",
        "cena": 84,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Kaczka w swej całej krasie, nacierana świeżym majerankiem i wolniutko pieczona we własnym tłuszczu z kwaśnymi jabłkami odmiany Reneta",
        "gramatura": "cała kaczka - 1 szt.",
        "cena": 158,
        "vegan": false,
        "vegetarian": false
      }
    ]
  },
  {
    "nazwa_kategorii": "Dodatki",
    "opis_kategorii": "Wszystkie nasze potrawy są przygotowywane z najlepszej jakości produktów, bez użycia ulepszaczy smaku, konserwantów i barwników.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Ręcznie robione pyzy drożdżowe",
        "gramatura": "3 szt. - 1 porcja",
        "cena": 18,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Paszteciki z ciasta francuskiego z polnymi pieczarkami (do barszczu)",
        "gramatura": "1 szt.",
        "cena": 12,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Krokiety z kapustą kiszoną i grzybami leśnymi (do barszczu)",
        "gramatura": "1 szt.",
        "cena": 13,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Delikatne kremowe puree ziemniaczane",
        "gramatura": "200 g - 1 porcja",
        "cena": 16,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Młode ziemniaki pieczone w świeżych ziołach prowansalskich",
        "gramatura": "200 g - 1 porcja",
        "cena": 17,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Domowe babcine kopytka",
        "gramatura": "200 g - 1 porcja",
        "cena": 16,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Buraczki zasmażane z chrzanem na wiejskim maśle",
        "gramatura": "200 g - 1 porcja",
        "cena": 17,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Modra kapusta wolno gotowana z jagodami żurawiny, wędzonymi śliwkami i świeżo tartą laską cynamonu",
        "gramatura": "200 g - 1 porcja",
        "cena": 18,
        "vegan": true,
        "vegetarian": true
      }
    ]
  },
  {
    "nazwa_kategorii": "Sosy",
    "opis_kategorii": "Wszystkie nasze potrawy są przygotowywane z najlepszej jakości produktów, bez użycia ulepszaczy smaku, konserwantów i barwników.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Świeżo tarty chrzan z gęstą wiejską śmietaną od Kulczaków",
        "gramatura": "100 ml - 1 porcja",
        "cena": 9,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Domowy sos tatarski",
        "gramatura": "100 ml - 1 porcja",
        "cena": 13,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Sos własny pieczeniowy wołowy",
        "gramatura": "100 ml - 1 porcja",
        "cena": 16,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Głęboki sos z suszonych jagód żurawiny, gruszek i wędzonych śliwek perfumowany świeżym tymiankiem (do kaczki)",
        "gramatura": "100 ml - 1 porcja",
        "cena": 18,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Głęboki sos z jagód żurawiny z kruszonymi owocami jałowca i trawą żubrową (do pasztetu)",
        "gramatura": "100 ml - 1 porcja",
        "cena": 19,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Kremowy gęsty sos z borowikami i kruszonymi owocami jałowca aromatyzowany trawą żubrową",
        "gramatura": "100 ml - 1 porcja",
        "cena": 26,
        "vegan": false,
        "vegetarian": true
      }
    ]
  },
  {
    "nazwa_kategorii": "Desery",
    "opis_kategorii": "Wszystkie nasze potrawy są przygotowywane z najlepszej jakości produktów, bez użycia ulepszaczy smaku, konserwantów i barwników.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Wielkanocna piaskowa baba własnego wypieku",
        "gramatura": "1 szt.",
        "cena": 48,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Domowy pieczony sernik",
        "gramatura": "ok. 0,6 kg",
        "cena": 58,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Piernik korzenny z kremowym Mascarpone i karmelizowanymi orzechami włoskimi",
        "gramatura": "ok. 0,6 kg",
        "cena": 64,
        "vegan": false,
        "vegetarian": true
      }
    ]
  },
  {
    "nazwa_kategorii": "Menu dziecięce",
    "opis_kategorii": "Wszystkie nasze potrawy są przygotowywane z najlepszej jakości produktów, bez użycia ulepszaczy smaku, konserwantów i barwników.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Polędwiczki z kurczaka zagrodowego panierowane w płatkach kukurydzianych",
        "gramatura": "150 g - 1 porcja",
        "cena": 39,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Młoda marchew z zielonym groszkiem cukrowym na klarowanym wiejskim masełku",
        "gramatura": "200 g - 1 porcja",
        "cena": 14,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Surówka z młodej karotki i soczystego jabłuszka",
        "gramatura": "200 g - 1 porcja",
        "cena": 16,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Delikatne kremowe puree ziemniaczane",
        "gramatura": "200 g - 1 porcja",
        "cena": 14,
        "vegan": false,
        "vegetarian": true
      }
    ]
  }
];

fs.writeFileSync('source_data.json', JSON.stringify(data, null, 2));

const phpCode = `<?php
define('WP_USE_THEMES', false);
require_once '${clientRemoteConfig.remoteWordPressRoot}/wp-load.php';

$jsonData = file_get_contents('source_data.json');
$data = json_decode($jsonData, true);
if (!$data) {
    die("Invalid JSON");
}

foreach ($data as &$category) {
    $cat_name = $category['nazwa_kategorii'];
    
    $term = term_exists($cat_name, 'product_cat');
    if ($term !== 0 && $term !== null) {
        $cat_id = is_array($term) ? $term['term_id'] : $term;
    } else {
        $term_info = wp_insert_term($cat_name, 'product_cat', [
            'description' => $category['opis_kategorii']
        ]);
        if (is_wp_error($term_info)) {
            $cat_id = null;
        } else {
            $cat_id = $term_info['term_id'];
        }
    }
    $category['id'] = $cat_id;

    foreach ($category['pozycje'] as &$produkt) {
        $prod_name = $produkt['zespolona_nazwa_z_opisem'];
        $price = $produkt['cena'];
        $gramatura = $produkt['gramatura'];
        
        $product_obj = new WC_Product_Simple();
        $product_obj->set_name($prod_name);
        $product_obj->set_status('publish');
        $product_obj->set_catalog_visibility('visible');
        $product_obj->set_price($price);
        $product_obj->set_regular_price($price);
        if ($cat_id) {
            $product_obj->set_category_ids([$cat_id]);
        }
        
        // Add custom meta "gramatura"
        $product_obj->update_meta_data('gramatura', $gramatura);
        if (isset($produkt['vegan'])) {
             $product_obj->update_meta_data('vegan', $produkt['vegan'] ? 'yes' : 'no');
        }
        if (isset($produkt['vegetarian'])) {
             $product_obj->update_meta_data('vegetarian', $produkt['vegetarian'] ? 'yes' : 'no');
        }
        
        $post_id = $product_obj->save();
        $produkt['id'] = $post_id;
    }
}

echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
`;

fs.writeFileSync('import.php', phpCode);

try {
    console.log("Uploading files to server...");
  execFileSync('scp', ['-i', clientRemoteConfig.sshKeyPath, 'source_data.json', 'import.php', `${clientRemoteConfig.sshTarget}:~`], { stdio: 'inherit' });
    
    console.log("Executing import script on server...");
  const result = execFileSync('ssh', ['-i', clientRemoteConfig.sshKeyPath, clientRemoteConfig.sshTarget, 'php83', 'import.php'], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 5 });
    
    fs.writeFileSync('result_with_ids.json', result);
    console.log("Operation Complete! Output saved to result_with_ids.json");
    
    console.log("Cleaning up remote files...");
  execFileSync('ssh', ['-i', clientRemoteConfig.sshKeyPath, clientRemoteConfig.sshTarget, 'rm', 'source_data.json', 'import.php'], { stdio: 'ignore' });
} catch (e) {
    console.error("Error occurred:", e.message);
    if(e.stdout) console.error(e.stdout.toString());
}
