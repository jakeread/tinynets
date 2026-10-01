DOCNAME=main
OPEN := $(shell grep -qi microsoft /proc/version 2>/dev/null && echo wslview || echo open)
ELSARTICLE_URL=https://assets.ctfassets.net/o78em1y1w4i4/4MpsJHO0MOJ2xZuwGTAbOZ/7bc64af36477c5d6cfce335a1f872363/elsarticle.zip	

all: report graphical_abstract.pdf

.PHONY: clean distclean submit

elsarticle.zip:
	curl -L -o elsarticle.zip $(ELSARTICLE_URL)

elsarticle.cls: elsarticle.zip
	unzip -jo elsarticle.zip '*.ins' '*.dtx' '*.bst'
	latex elsarticle.ins

report: elsarticle.cls
	pdflatex $(DOCNAME).tex
	bibtex $(DOCNAME).aux
	pdflatex $(DOCNAME).tex
	pdflatex $(DOCNAME).tex
	@echo "Word Count:"
	detex $(DOCNAME).tex | wc -w

graphical_abstract.pdf: graphical_abstract.tex
	pdflatex graphical_abstract.tex

view: report
	$(OPEN) $(DOCNAME).pdf

submit: graphical_abstract.pdf
	lateflat .
	cp elsarticle-num.bst submit/
	cd submit && pdflatex $(DOCNAME).tex && bibtex $(DOCNAME).aux && pdflatex $(DOCNAME).tex && pdflatex $(DOCNAME).tex
	cp declarationStatement.docx submit/
	cp graphical_abstract.pdf submit/
	rm submit/main.aux submit/main.bbl submit/main.blg submit/main.log submit/main.out submit/main.spl
	$(OPEN) submit/$(DOCNAME).pdf
# 	references.bib needs to be labeled "Author biography" (sic). Attach a random .tex file for the required "LaTeX source files". If you go back to edit you're uploads, it will delete some of them.

clean:
	rm -f *.blg *.bbl *.aux *.log *.spl

distclean: clean
	rm -f elsarticle.zip elsarticle.cls elsarticle.ins elsarticle.dtx \
	      elsarticle-harv.bst elsarticle-num.bst elsarticle-num-names.bst