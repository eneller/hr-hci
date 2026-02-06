@default_files = ('report.Rnw');
$latex = 'latex  %O  --shell-escape %S';
$pdflatex = 'pdflatex --shell-escape %S -synctex=1 %O %S';
$pdf_mode = 1;
$clean_ext = 'lol nav snm loa bbl* glo ist tex aux bbl blg log out toc Rnw.tex %R-concordance.tex %R.tex';
$bibtex_use = 2;

# only enable when compiling .Rnw or .Rtex file
if(grep(/\.(rnw|rtex)$/i, @ARGV)) {
    $latex = 'internal knitrlatex ' . $latex;
    $pdflatex = 'internal knitrlatex ' . $pdflatex;
    my $knitr_compiled = {};
    sub knitrlatex {
        for (@_) {
            next unless -e $_;
            my $input = $_;
            next unless $_ =~ s/\.(rnw|rtex)$/.tex/i;
            my $tex = $_;
            my $checksum = (fdb_get($input))[-1];
            if (!$knitr_compiled{$input} || $knitr_compiled{$input} ne $checksum) {
                my $ret = system("Rscript -e \"knitr::knit('$input')\"");
                if($ret) { return $ret; }
                rdb_ensure_file($rule, $tex);
                $knitr_compiled{$input} = $checksum;
            }
        }
        return system(@_);
    }
}
