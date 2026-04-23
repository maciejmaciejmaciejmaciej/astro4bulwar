export function BlogSection() {
  return (
    <section className="py-32 bg-surface page-margin">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-headline text-3xl tracking-[0.3rem] uppercase">ANDÉ BLOG</h2>
          <a className="font-label text-xs uppercase tracking-widest border-b border-primary pb-1" href="#">VIEW ALL</a>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="group cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden mb-6 rounded-[4px]">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-[4px]" alt="Garlic pasta" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxFMdjkz2lZ0yF7rYhyF7A9pvnp955ToFubj8_I1gQaHOOwVAd8HhhB3mlyQXDldXAz_Ph2f-sd9RbZsa7du1oupNqnTbtGbWHy902reWTF4v6OJF80-f6pLmHMmvPwNs1i7ypGuWg1y4VluOVsXblEecuE5Jk9FLYp7DalGX3U6Hi-lf7bb5B9NnhRV87ZCJ-X4cwQooOVfOL8i1AFoOWc6MR_LYa_rHtXfAAFOrxK1_a1oI1WzznkwltlIHQWuLHkPPqw_HAiYs" />
            </div>
            <span className="font-label text-[10px] text-zinc-500 tracking-widest uppercase mb-2 block">06.06.2018</span>
            <h3 className="font-headline text-xl mb-4 group-hover:underline underline-offset-8 decoration-1">GARLIC PASTA</h3>
            <a className="font-label text-[10px] uppercase tracking-widest text-primary font-bold" href="#">DISCOVER</a>
          </div>
          <div className="group cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden mb-6 rounded-[4px]">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-[4px]" alt="Parmesan risotto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsqpMKxDFSsShMRqaBcwlkyw33jDMHBhMqmBBg-reEXSVsMqGTTwecV6oXNDV0lRInHiw9B61SjXF5rvg0pmpWfgcHbWTNSSNTzJoD5nmRVORT0W1sUCQojWMpiAN9fQy3XX06MCbmTw5vLcjwYhcU9yqz4Sh2ezpjHH1tdNOlgsCD7Pw-rGWsPVNzlATwtlqTsGr5MS00tH4taVYFuwIzHRBc29fv8Hag5hujF5rGEvQ0eJGrjlm8aGUh8JU2CNBIoCN111JspzQ" />
            </div>
            <span className="font-label text-[10px] text-zinc-500 tracking-widest uppercase mb-2 block">12.06.2018</span>
            <h3 className="font-headline text-xl mb-4 group-hover:underline underline-offset-8 decoration-1">PARMESAN RISOTTO</h3>
            <a className="font-label text-[10px] uppercase tracking-widest text-primary font-bold" href="#">DISCOVER</a>
          </div>
          <div className="group cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden mb-6 rounded-[4px]">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-[4px]" alt="Weekly specials" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUtZfmA8KVR9xXaMq_NG7lkS6PUXbYMeOv7XmgXTwPMDrNsaKeZMPB3EKOqsDVJCrW2fFHABaz-olIaK7BXv8aZuxES8Fu50qJkTeu5vs2xZiUnxDoG94wf90ONTKDakWs-dwWf1czgdgjGSBDf1ONGcR-SxNpkcyoq2QUzCIdfeXpx2WwsZ0bcmqIx00oaqNcW20Ntn29HGWKyw93_eZnZIO1oZ0pGZIdF_5YaXvg_3jUDwOxm69h4oQO6HUPnnj1mMe8Llbqa7w" />
            </div>
            <span className="font-label text-[10px] text-zinc-500 tracking-widest uppercase mb-2 block">18.06.2018</span>
            <h3 className="font-headline text-xl mb-4 group-hover:underline underline-offset-8 decoration-1">WEEKLY SPECIALS</h3>
            <a className="font-label text-[10px] uppercase tracking-widest text-primary font-bold" href="#">DISCOVER</a>
          </div>
        </div>
      </div>
    </section>
  );
}