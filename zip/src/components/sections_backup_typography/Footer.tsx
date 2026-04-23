export function Footer() {
  return (
    <footer className="w-full py-20 border-t border-zinc-200 bg-zinc-50 page-margin">
      <div className="flex flex-col items-center text-center space-y-8 w-full">
        <div className="font-headline font-bold tracking-[0.2rem] text-3xl mb-4 flex items-center">
          <span>A</span>
          <div className="w-[1px] h-8 bg-primary mx-2"></div>
          <span>NDÉ</span>
        </div>
        <div className="grid md:grid-cols-3 gap-12 w-full max-w-4xl font-body text-sm text-zinc-500 tracking-wide">
          <div className="space-y-2">
            <h4 className="font-label font-bold text-on-surface uppercase tracking-widest text-[10px] mb-4">LOCATION</h4>
            <p>787 5th Avenue, NY</p>
            <p>New York, 10022</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-label font-bold text-on-surface uppercase tracking-widest text-[10px] mb-4">CONTACT</h4>
            <p>+1 212 555 0198</p>
            <p>hello@andecurator.com</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-label font-bold text-on-surface uppercase tracking-widest text-[10px] mb-4">HOURS</h4>
            <p>Mon - Sat: 5pm - 11pm</p>
            <p>Sun: Closed</p>
          </div>
        </div>
        <div className="flex space-x-8 py-8 border-y border-outline-variant/20 w-full max-w-4xl justify-center">
          <a className="font-label tracking-[0.1rem] uppercase text-[10px] md:text-xs text-zinc-500 hover:text-black transition-colors underline underline-offset-4" href="#">Facebook</a>
          <a className="font-label tracking-[0.1rem] uppercase text-[10px] md:text-xs text-zinc-500 hover:text-black transition-colors underline underline-offset-4" href="#">Instagram</a>
          <a className="font-label tracking-[0.1rem] uppercase text-[10px] md:text-xs text-zinc-500 hover:text-black transition-colors underline underline-offset-4" href="#">Trip Advisor</a>
          <a className="font-label tracking-[0.1rem] uppercase text-[10px] md:text-xs text-zinc-500 hover:text-black transition-colors underline underline-offset-4" href="#">Privacy Policy</a>
        </div>
        <p className="font-label tracking-[0.1rem] uppercase text-[10px] text-zinc-400">© 2024 ANDÉ CULINARY CURATOR. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
