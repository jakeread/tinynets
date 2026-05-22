DOCNAME=root
ELSARTICLE_URL=https://assets.ctfassets.net/o78em1y1w4i4/4MpsJHO0MOJ2xZuwGTAbOZ/7bc64af36477c5d6cfce335a1f872363/elsarticle.zip	

all: report

.PHONY: clean distclean

elsarticle.zip:
	curl -L -o elsarticle.zip $(ELSARTICLE_URL)

elsarticle.cls: elsarticle.zip
	unzip -jo elsarticle.zip '*.ins' '*.dtx' '*.bst'
	latex elsarticle.ins

report:
	pdflatex $(DOCNAME).tex
	bibtex $(DOCNAME).aux
	pdflatex $(DOCNAME).tex
	pdflatex $(DOCNAME).tex
	@echo "Word Count:"
	detex $(DOCNAME).tex | wc -w
	wslview $(DOCNAME).pdf

view: report
	wslview $(DOCNAME).pdf

clean:
	rm -f *.blg *.bbl *.aux *.log *.spl

distclean: clean
	rm -f elsarticle.zip elsarticle.cls elsarticle.ins elsarticle.dtx \
	      elsarticle-harv.bst elsarticle-num.bst elsarticle-num-names.bst