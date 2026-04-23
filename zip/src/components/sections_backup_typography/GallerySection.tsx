
export function GallerySection() {
  return (
    <>
{/* Gallery Section */}
        <section className="py-32 bg-zinc-950 text-white page-margin">
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-16">
              <h2 className="font-headline text-3xl tracking-[0.3rem] uppercase">ANDÉ GALLERY</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-start">
              {/* Column 1 */}
              <div className="flex flex-col gap-4 md:gap-6 md:mt-12">
                <div className="aspect-square bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfpYBaywo_vBcuNB56jmEs52NUzR8JKqAY59tV1zPskK9GYsIkOWCHDsdsIjhiRrOzmVRg0w5LjKSY9MtpU_7Wm-ZuJVPzaT2ZmdKFnf3LJPqgt1arRXrOHXQRAfvGnr68JRDzb5BwYctI373k4b7tFanjsmg9H2uHcim8_gfyZy1koQZrzUbNJbRcn1b6u6ffnBfMeW1UYc8yFRWycUfkfFohRM4lgckcSt8yXcMVkeUdc_XT15OycPy3AoZdVF37YONibmhRdTA')" }}></div>
                <div className="aspect-[4/5] bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAmvwzpoeiKBkHih4QMAP5hzmSCSzV3HFYMEpZ4VZvEkhv9tWnj7VFFHG57w2j4YY_cn_gNUHZRG7e07fvpNqLc-DbnPsjjVGIV-xIULwR1cQVWnym3feuB0pErllKDMzOCsi6wjpoZ0-OGlwuthkD-mCEU40QuHkNIg-_G3E77wiKCTJVsuHovM8OSvr6YmFWLVKNUO-dPNRTWBVhsJADIcHh4E-IabBhm_-GaKdxlJvGfGu83BPOkOMBBhAiSgx6pkmmwTZjeZfk')" }}></div>
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="aspect-[3/4] bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfmXBiUNQ_kGf19-tbCX0EfV3IuP1VBMQNV_t-zE7X4iYvOhVEEr2HD88elGNe92LNWV4uETpeMr22-Z-4TErWO5YhgwHFjGsLqbIzXzhaEqHrMiJ_wLD6lqURejbpj9y-IH3xI9TVNvllrH8Zy6cTIcOHjPF9ZT1xnlFZixunnqwpvM9JeUiRN_HJ-LgOca4L31GYDDMPVOJFaDNJHUJAvjS7iF524AbL7Pp6M4Hd1daaUX6B6n7RyCDQagrNwqrS3dgg5FxGvuk')" }}></div>
                <div className="aspect-square bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA436oSTIeeaTibLtXGFJ1s_sD9j2cnWJOSSSI-Rp59xPhvmnEENWouZwTx1VKThlprLCsXdj5G-RdgAznaT1ewXB_qSi0Ov87g4rxeg8BVkCemOYfYfdzUX5R6qOH7eat54m98_SXosJYeWSxRRmn9iydZf3mmzBo_8-Dj8VtnJCRKhXnusZ95BybxG35I7oyjFSlrxg9-zYCE54p_1OvKTAXBMHj7APQaOVF1WZOBpFzjrYMcmLoFsRHHYSVyMkKKZVmFra1jy5M')" }}></div>
              </div>
              {/* Column 3 */}
              <div className="flex flex-col gap-4 md:gap-6 md:mt-24">
                <div className="aspect-[4/5] bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvAq4RIrwZm1pkFoSty9S07_XgDQdFREFuuw4eA1giR0UbbuIJf0KDFXm8kVPbiYaf4DAcP4BFVrw_Wqvhg4LJ7qpte2Ysv6lvnEWS5jBAJ8eITibW0h6y_Hb5UkTZxbdQNTDm3vVxqEzC5h8UJltCFv1USKkBaSR_UG2jPgqI6W26mtbISYWK6XroAc6GJ6zB0JIxSRZNab70cEYX0o45eCNFN0zyZKUQ1_JsQaRVHpaL2xx7CZZwj5iLjooh0oV7dvJQsS04JQc')" }}></div>
              </div>
              {/* Column 4 */}
              <div className="flex flex-col gap-4 md:gap-6 md:mt-8">
                <div className="aspect-square bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAeaiRvBHJBbZCjIH9Ayx6sx6x2vzvgyxJZwSt7HCciIY0ks9sbfge0h7UfcIZAaxxIsrsqfCXjf-QOO3vP1o4ZKR-RF4sh3Tz0d_bMsSwBDQzOuU-Y8x5_DWftbZYh9-f-_G0sjHK9sHizS16syTDobznmJbpETroIOZTq2N2TQ610AtRpfVpD78JTix2vkrnys4p7nXrtxP-1rGuTTtLjOkTf1v3o_aOkRfeFG1DFn56zRj6X2kB8hnjN0OvIrCT5gzZWgly8TLg')" }}></div>
                <div className="aspect-[4/5] bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQIvrfpDC8xf8BuaSSbgEVk-Dq3FLZmUmUQbz8IjvwVR0_tgbvq7Eb_KLZfVT_ybXb0vDzJAqlTYZXBCr3pY4gXCCPPSWL9BaSw4B_dupZeoiuwoKb-AFSCdXbZjmMjMWkyxnVKEeVFY0VQ7VwQ03No3k48_7gWGyOcgPYCnFG-N28PH_7nEDRdyMAGbomFowKaa-a_4hsIy5WNPrax6ioTX7x3BcVRDXIpErypLWgRtQDKNnqvyS9JIBnEBNmGl0Md8SDxanOyC8')" }}></div>
              </div>
            </div>
          </div>
        </section>

        
    </>
  );
}
