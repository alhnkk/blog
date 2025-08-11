import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const Newsletter = () => {
  return (
    <div className="py-16">
      <div className="max-w-sm mx-auto text-center px-4">
        <h3 className="text-xl font-light mb-2">Bülten</h3>
        <div className="w-8 h-px bg-border mx-auto mb-6" />
        <p className="text-muted-foreground text-sm mb-8 font-light">
          Yeni yazılardan haberdar olun
        </p>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="E-posta adresiniz"
            className="text-center"
          />
          <Button className="w-full font-light">Abone Ol</Button>
        </div>
      </div>
      <Separator className="mt-16" />
    </div>
  );
};

export default Newsletter;
