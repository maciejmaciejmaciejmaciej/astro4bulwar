const fs = require('fs');
const { execFileSync } = require('child_process');

const { getClientRemoteConfig } = require('./clientGeneratedEnv');

const clientRemoteConfig = getClientRemoteConfig();

const data = [
  {
    "nazwa_kategorii": "Pieczywo",
    "opis_kategorii": "Wszystkie nasze potrawy s� przygotowywane z najlepszej jako�ci produkt�w, bez u�ycia ulepszaczy smaku, konserwant�w i barwnik�w.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Chleb w�asnego wypieku na zakwasie z m�ki �ytniej i piwie pszenicznym",
        "gramatura": "0,5 kg - 1 szt.",
        "cena": 29,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Chleb w�asnego wypieku na zakwasie z m�ki �ytniej i piwie pszenicznym",
        "gramatura": "1 kg - 1 szt.",
        "cena": 39,
        "vegan": true,
        "vegetarian": true
      }
    ]
  },
  {
    "nazwa_kategorii": "Zupy",
    "opis_kategorii": "Wszystkie nasze potrawy s� przygotowywane z najlepszej jako�ci produkt�w, bez u�ycia ulepszaczy smaku, konserwant�w i barwnik�w.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Ros� z kury domowej gotowany 12 godzin na wolnym ogniu, z ekologiczn� marchewk�, �wie�o ci�tym lubczykiem i natk� m�odej pietruszki",
        "gramatura": "0,9 l",
        "cena": 68,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Barszcz bardzo czerwony gotowany z suszonymi borowikami i kwa�nymi jab�kami, pe�en czosnku i �wie�ego majeranku",
        "gramatura": "0,9 l",
        "cena": 78,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Domowy �urek na 5-ciodniowym zakwasie z m�ki �ytniej razowej gotowany na w�dzonych �eberkach, z bia�� surow� kie�bas�, pe�en czosnku i �wie�o tartego chrzanu",
        "gramatura": "0,9 l",
        "cena": 79,
        "vegan": false,
        "vegetarian": false
      }
    ]
  },
  {
    "nazwa_kategorii": "Przystawki",
    "opis_kategorii": "Wszystkie nasze potrawy s� przygotowywane z najlepszej jako�ci produkt�w, bez u�ycia ulepszaczy smaku, konserwant�w i barwnik�w.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Jajo wiejskie dekorowane �wie�� wielkanocn� rze�uch� i kie�kami amarantusa z farszem ze �wie�� rzodkiewk�, majonezem, rze�uch� i korniszonami",
        "gramatura": "2 po��wki - 1 szt.",
        "cena": 13,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Jajo wiejskie dekorowane �wie�� wielkanocn� rze�uch� i kie�kami amarantusa z farszem z polnymi br�zowymi pieczarkami, majonezem, wiejskim mas�em, grubym szczypiorem z m�odej dymki i �wie�� rzodkiewk�",
        "gramatura": "2 po��wki - 1 szt.",
        "cena": 16,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Jajo wiejskie dekorowane �wie�� wielkanocn� rze�uch� i kie�kami amarantusa z farszem z w�dzonym �ososiem ba�tyckim, creme fraiche, �wie�o tartym chrzanem i m�odym szczypiorkiem",
        "gramatura": "2 po��wki - 1 szt.",
        "cena": 19,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Tradycyjna sa�atka Wielkanocna z ekologicznych warzyw korzennych, ze �wie�ym jab�kiem Gr�jeckim, wiejskimi jajami od kur zielonon�ek i �wie�� natk� pietruszki",
        "gramatura": "100 g",
        "cena": 16,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Bia�a surowa kie�basa z czosnkiem nied�wiedzim pieczona w piwie pszenicznym z Mi�os�awia z miodem gryczanym, ziarnami gorczycy, musztard� i �wie�ym majerankiem",
        "gramatura": "ok. 200 g - 1 szt.",
        "cena": 19,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "�led� ba�tycki w kwa�nej wiejskiej �mietanie z kwa�n� Renet� i szalotk� bananow�",
        "gramatura": "100 g",
        "cena": 18,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Schab Z�otnicki wolno gotowany w niskiej temperaturze, marynowany w zio�ach prowansalskich i faszerowany suszon� �liwk� sechlo�sk�, podany w galarecie",
        "gramatura": "100 g",
        "cena": 27,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Pier� z indyka wolno gotowana w niskiej temperaturze, marynowana w zio�ach prowansalskich i faszerowana suszonymi morelami, podana w galarecie",
        "gramatura": "100 g",
        "cena": 28,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Pasztet wegetaria�ski z soczewic� i orzechami w�oskimi",
        "gramatura": "100 g",
        "cena": 26,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Staropolski pasztet z jelenia pe�en �wie�ych zi� i owoc�w runa le�nego",
        "gramatura": "100 g",
        "cena": 29,
        "vegan": false,
        "vegetarian": false
      }
    ]
  },
  {
    "nazwa_kategorii": "�wi�teczny obiad",
    "opis_kategorii": "Wszystkie nasze potrawy s� przygotowywane z najlepszej jako�ci produkt�w, bez u�ycia ulepszaczy smaku, konserwant�w i barwnik�w.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Devolay z piersi kurczaka zagrodowego pe�en wiejskiego mas�a i m�odej naci ekologicznej pietruszki",
        "gramatura": "1 szt.",
        "cena": 48,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Konfitowana n�ka z kaczki leniwie pieczona w g�sim t�uszczu",
        "gramatura": "1 szt.",
        "cena": 52,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Domowe zrazy wo�owe s�usznej wielko�ci, z czosnkowym og�rkiem kiszonym, razowym chlebem wiejskim i w�dzonym boczkiem",
        "gramatura": "1 szt.",
        "cena": 54,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Kaczka w swej ca�ej krasie, nacierana �wie�ym majerankiem i wolniutko pieczona we w�asnym t�uszczu z kwa�nymi jab�kami odmiany Reneta",
        "gramatura": "1/2 kaczki - 1 szt.",
        "cena": 84,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "Kaczka w swej ca�ej krasie, nacierana �wie�ym majerankiem i wolniutko pieczona we w�asnym t�uszczu z kwa�nymi jab�kami odmiany Reneta",
        "gramatura": "ca�a kaczka - 1 szt.",
        "cena": 158,
        "vegan": false,
        "vegetarian": false
      }
    ]
  },
  {
    "nazwa_kategorii": "Dodatki",
    "opis_kategorii": "Wszystkie nasze potrawy s� przygotowywane z najlepszej jako�ci produkt�w, bez u�ycia ulepszaczy smaku, konserwant�w i barwnik�w.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "R�cznie robione pyzy dro�d�owe",
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
        "zespolona_nazwa_z_opisem": "Krokiety z kapust� kiszon� i grzybami le�nymi (do barszczu)",
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
        "zespolona_nazwa_z_opisem": "M�ode ziemniaki pieczone w �wie�ych zio�ach prowansalskich",
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
        "zespolona_nazwa_z_opisem": "Buraczki zasma�ane z chrzanem na wiejskim ma�le",
        "gramatura": "200 g - 1 porcja",
        "cena": 17,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Modra kapusta wolno gotowana z jagodami �urawiny, w�dzonymi �liwkami i �wie�o tart� lask� cynamonu",
        "gramatura": "200 g - 1 porcja",
        "cena": 18,
        "vegan": true,
        "vegetarian": true
      }
    ]
  },
  {
    "nazwa_kategorii": "Sosy",
    "opis_kategorii": "Wszystkie nasze potrawy s� przygotowywane z najlepszej jako�ci produkt�w, bez u�ycia ulepszaczy smaku, konserwant�w i barwnik�w.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "�wie�o tarty chrzan z g�st� wiejsk� �mietan� od Kulczak�w",
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
        "zespolona_nazwa_z_opisem": "Sos w�asny pieczeniowy wo�owy",
        "gramatura": "100 ml - 1 porcja",
        "cena": 16,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "G��boki sos z suszonych jag�d �urawiny, gruszek i w�dzonych �liwek perfumowany �wie�ym tymiankiem (do kaczki)",
        "gramatura": "100 ml - 1 porcja",
        "cena": 18,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "G��boki sos z jag�d �urawiny z kruszonymi owocami ja�owca i traw� �ubrow� (do pasztetu)",
        "gramatura": "100 ml - 1 porcja",
        "cena": 19,
        "vegan": true,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Kremowy g�sty sos z borowikami i kruszonymi owocami ja�owca aromatyzowany traw� �ubrow�",
        "gramatura": "100 ml - 1 porcja",
        "cena": 26,
        "vegan": false,
        "vegetarian": true
      }
    ]
  },
  {
    "nazwa_kategorii": "Desery",
    "opis_kategorii": "Wszystkie nasze potrawy s� przygotowywane z najlepszej jako�ci produkt�w, bez u�ycia ulepszaczy smaku, konserwant�w i barwnik�w.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Wielkanocna piaskowa baba w�asnego wypieku",
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
        "zespolona_nazwa_z_opisem": "Piernik korzenny z kremowym Mascarpone i karmelizowanymi orzechami w�oskimi",
        "gramatura": "ok. 0,6 kg",
        "cena": 64,
        "vegan": false,
        "vegetarian": true
      }
    ]
  },
  {
    "nazwa_kategorii": "Menu dzieci�ce",
    "opis_kategorii": "Wszystkie nasze potrawy s� przygotowywane z najlepszej jako�ci produkt�w, bez u�ycia ulepszaczy smaku, konserwant�w i barwnik�w.",
    "pozycje": [
      {
        "zespolona_nazwa_z_opisem": "Pol�dwiczki z kurczaka zagrodowego panierowane w p�atkach kukurydzianych",
        "gramatura": "150 g - 1 porcja",
        "cena": 39,
        "vegan": false,
        "vegetarian": false
      },
      {
        "zespolona_nazwa_z_opisem": "M�oda marchew z zielonym groszkiem cukrowym na klarowanym wiejskim mase�ku",
        "gramatura": "200 g - 1 porcja",
        "cena": 14,
        "vegan": false,
        "vegetarian": true
      },
      {
        "zespolona_nazwa_z_opisem": "Sur�wka z m�odej karotki i soczystego jab�uszka",
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

const phpCode = \<?php
define('WP_USE_THEMES', false);
require_once '${clientRemoteConfig.remoteWordPressRoot}/wp-load.php';

\ = file_get_contents('source_data.json');
\ = json_decode(\, true);
if (!\) {
    die("Invalid JSON");
}

foreach (\ as &\) {
    \ = \['nazwa_kategorii'];
    
    \ = term_exists(\, 'product_cat');
    if (\ !== 0 && \ !== null) {
        \ = is_array(\) ? \['term_id'] : \;
    } else {
        \ = wp_insert_term(\, 'product_cat', [
            'description' => \['opis_kategorii']
        ]);
        if (is_wp_error(\)) {
            \ = null;
        } else {
            \ = \['term_id'];
        }
    }
    \['id'] = \;

    foreach (\['pozycje'] as &\) {
        \ = \['zespolona_nazwa_z_opisem'];
        \ = \['cena'];
        \ = \['gramatura'];
        
        \ = new WC_Product_Simple();
        \->set_name(\);
        \->set_status('publish');
        \->set_catalog_visibility('visible');
        \->set_price(\);
        \->set_regular_price(\);
        if (\) {
            \->set_category_ids([\]);
        }
        
        // Add custom meta "gramatura"
        \->update_meta_data('gramatura', \);
        if (isset(\['vegan'])) {
             \->update_meta_data('vegan', \['vegan'] ? 'yes' : 'no');
        }
        if (isset(\['vegetarian'])) {
             \->update_meta_data('vegetarian', \['vegetarian'] ? 'yes' : 'no');
        }
        
        \ = \->save();
        \['id'] = \;
    }
}

echo json_encode(\, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
\;

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
